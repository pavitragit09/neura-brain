import time
import os
from datetime import datetime
from sqlalchemy.orm import Session

from app.parsers.document_parser import extract_text_from_file
from app.knowledge.chunking import chunk_text
from app.vectorstore.embeddings import generate_embedding
from app.vectorstore.retriever import store_chunks, delete_document_chunks
from app.services.sop_service import generate_sop_data
from app.services.audit_service import log_action
from app.repositories.sop_repository import create_sop
from app.models.document import Document
from app.models.sop import SOP

def ingest_document(
    db: Session,
    file_path: str,
    filename: str,
    source_type: str = "pdf",
    google_file_id: str | None = None,
    google_modified_time: datetime | None = None,
    google_web_view_link: str | None = None
) -> dict:
    """
    Unified entry point for ingesting any supported document format (PDF, DOCX, TXT, MD).
    Handles both new files and updates (idempotency, cleaning up old DB records and Qdrant chunks).
    """
    start_time = time.time()
    file_ext = os.path.splitext(file_path)[1]

    # Extract text content
    t0 = time.time()
    text = extract_text_from_file(file_path, file_ext)
    t1 = time.time()
    print(f"[INGEST TIMING] Text extraction: {t1 - t0:.3f} s")

    # Chunk text
    t0 = time.time()
    chunks = chunk_text(text)
    t1 = time.time()
    print(f"[INGEST TIMING] Chunking: {t1 - t0:.3f} s")

    # Generate embeddings
    t0 = time.time()
    embeddings = [generate_embedding(chunk) for chunk in chunks]
    t1 = time.time()
    print(f"[INGEST TIMING] Generate embeddings: {t1 - t0:.3f} s")

    # Check for existing document with this google_file_id
    existing_doc = None
    if google_file_id:
        existing_doc = db.query(Document).filter(Document.google_file_id == google_file_id).first()

    # Determine document record filename to match Qdrant source key
    doc_name = filename
    if existing_doc:
        # Keep old filename to match Qdrant chunks deletion key
        doc_name = existing_doc.filename

    # Clean up old vectors from Qdrant if updating
    t0 = time.time()
    delete_document_chunks(doc_name)
    t1 = time.time()
    print(f"[INGEST TIMING] Delete old vector chunks: {t1 - t0:.3f} s")

    # Store new vectors in Qdrant
    t0 = time.time()
    # Inject source details to metadata payload for citations
    points = []
    import uuid
    from qdrant_client.models import PointStruct
    from app.vectorstore.qdrant_client import client
    from app.core.config import settings

    for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": chunk,
                    "source": doc_name,
                    "chunk_index": idx,
                    "source_type": source_type,
                    "google_file_id": google_file_id,
                    "google_web_view_link": google_web_view_link
                }
            )
        )
    client.upsert(
        collection_name=settings.COLLECTION_NAME,
        points=points
    )
    t1 = time.time()
    print(f"[INGEST TIMING] Store Qdrant chunks: {t1 - t0:.3f} s")

    # Generate SOP
    t0 = time.time()
    sop_result = generate_sop_data(text)
    t1 = time.time()
    print(f"[INGEST TIMING] SOP generation & parsing: {t1 - t0:.3f} s")

    # Create new SOP record
    t0 = time.time()
    saved_sop = create_sop(
        db=db,
        document_name=filename,
        structured_sop=sop_result["structured_sop"],
        hallucination_score=sop_result["hallucination_score"],
        confidence_score=sop_result["confidence_score"],
        review_status=sop_result["review_status"]
    )
    t1 = time.time()
    print(f"[INGEST TIMING] SOP DB insertion: {t1 - t0:.3f} s")

    # Link SOP to document (create or update record)
    old_sop_id = None
    if existing_doc:
        old_sop_id = existing_doc.sop_id
        existing_doc.filename = filename
        existing_doc.sop_id = saved_sop.id
        existing_doc.source_type = source_type
        existing_doc.google_modified_time = google_modified_time
        existing_doc.google_web_view_link = google_web_view_link
        existing_doc.processing_status = "completed"
        db.commit()
        db.refresh(existing_doc)
        saved_document = existing_doc
        print(f"[INGEST] Updated existing document ID: {saved_document.id}")
    else:
        saved_document = Document(
            filename=filename,
            sop_id=saved_sop.id,
            source_type=source_type,
            google_file_id=google_file_id,
            google_modified_time=google_modified_time,
            google_web_view_link=google_web_view_link,
            processing_status="completed"
        )
        db.add(saved_document)
        db.commit()
        db.refresh(saved_document)
        print(f"[INGEST] Created new document ID: {saved_document.id}")

    # Remove old SOP if updating to prevent record leaks
    if old_sop_id:
        old_sop = db.query(SOP).filter(SOP.id == old_sop_id).first()
        if old_sop:
            db.delete(old_sop)
            db.commit()

    # Log action to audit service
    t0 = time.time()
    log_action(
        db=db,
        action="INGEST" if existing_doc else "UPLOAD",
        entity_type="DOCUMENT",
        entity_id=saved_document.id,
        performed_by="system",
        details=f"Synchronized {filename} from Google Drive" if google_file_id else f"Uploaded {filename}"
    )
    t1 = time.time()
    print(f"[INGEST TIMING] DB Auditing: {t1 - t0:.3f} s")

    total_time = time.time() - start_time
    print(f"[INGEST TIMING] Total ingestion time for {filename}: {total_time:.3f} s")

    return {
        "sop_id": saved_sop.id,
        "document_id": saved_document.id,
        "result": sop_result
    }

def ingest_pdf(db: Session, file_path: str, filename: str) -> dict:
    """
    Backward-compatible wrapper for manual PDF uploads.
    """
    return ingest_document(
        db=db,
        file_path=file_path,
        filename=filename,
        source_type="pdf"
    )