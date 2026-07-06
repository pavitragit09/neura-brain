from app.parsers.pdf_parser import (
    extract_pdf_text
)

from app.knowledge.chunking import (
    chunk_text
)

from app.vectorstore.embeddings import (
    generate_embedding
)

from app.vectorstore.retriever import (
    store_chunks
)

from app.services.sop_service import (
    process_document
)

from app.services.audit_service import (
    log_action
)


import time

def ingest_pdf(
    db,
    file_path: str,
    filename: str
):
    start_time = time.time()

    # Extract text
    t0 = time.time()
    text = extract_pdf_text(
        file_path
    )
    t1 = time.time()
    print(f"[INGEST TIMING] Text extraction: {t1 - t0:.3f} s")

    # Chunk document
    t0 = time.time()
    chunks = chunk_text(
        text
    )
    t1 = time.time()
    print(f"[INGEST TIMING] Chunking: {t1 - t0:.3f} s")

    # Generate embeddings
    t0 = time.time()
    embeddings = [
        generate_embedding(chunk)
        for chunk in chunks
    ]
    t1 = time.time()
    print(f"[INGEST TIMING] Generate embeddings: {t1 - t0:.3f} s")

    # Store in Qdrant
    t0 = time.time()
    store_chunks(
        chunks=chunks,
        embeddings=embeddings,
        document_name=filename
    )
    t1 = time.time()
    print(f"[INGEST TIMING] Vector store storage: {t1 - t0:.3f} s")

    # Generate SOP
    t0 = time.time()
    result = process_document(
        db=db,
        document_name=filename,
        document_text=text
    )
    t1 = time.time()
    print(f"[INGEST TIMING] SOP generation & parsing: {t1 - t0:.3f} s")

    # Create immutable audit log
    t0 = time.time()
    log_action(
        db=db,
        action="UPLOAD",
        entity_type="DOCUMENT",
        entity_id=result["document_id"],
        performed_by="system",
        details=f"Uploaded {filename}"
    )
    t1 = time.time()
    print(f"[INGEST TIMING] DB Auditing: {t1 - t0:.3f} s")

    total_time = time.time() - start_time
    print(f"[INGEST TIMING] Total ingestion time for {filename}: {total_time:.3f} s")

    return result