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


def ingest_pdf(
    db,
    file_path: str,
    filename: str
):

    # Extract text
    text = extract_pdf_text(
        file_path
    )

    # Chunk document
    chunks = chunk_text(
        text
    )

    # Generate embeddings
    embeddings = [
        generate_embedding(chunk)
        for chunk in chunks
    ]

    # Store in Qdrant
    store_chunks(
        chunks=chunks,
        embeddings=embeddings,
        document_name=filename
    )

    # Generate SOP
    result = process_document(
        db=db,
        document_name=filename,
        document_text=text
    )

    # Create immutable audit log
    log_action(
        db=db,
        action="UPLOAD",
        entity_type="DOCUMENT",
        entity_id=result["document_id"],
        performed_by="system",
        details=f"Uploaded {filename}"
    )

    return result