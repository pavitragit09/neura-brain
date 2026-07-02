from fastapi import HTTPException, status

from app.core.config import settings

from app.repositories.document_repository import (
    get_document_by_id
)

from app.repositories.sop_repository import (
    get_sop_by_id
)

from app.services.audit_service import (
    log_action
)

from app.vectorstore.retriever import (
    delete_document_chunks
)


def delete_document(
    db,
    document_id: int,
    performed_by: str = "system"
):

    document = get_document_by_id(
        db,
        document_id
    )

    if not document:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found."
        )

    filename = document.filename

    sop = get_sop_by_id(
        db,
        document.sop_id
    )

    # Delete vectors from Qdrant
    delete_document_chunks(
        filename
    )

    # Delete uploaded PDF
    file_path = (
        settings.UPLOAD_DIR / filename
    )

    if file_path.exists():

        file_path.unlink()

    # Delete SOP
    if sop:

        db.delete(sop)

    # Delete Document
    db.delete(document)

    # Commit database changes
    db.commit()

    # Audit Log
    log_action(
        db=db,
        action="DELETE",
        entity_type="DOCUMENT",
        entity_id=document_id,
        performed_by=performed_by,
        details=f"Deleted {filename}"
    )

    return {
        "message": "Document deleted successfully",
        "document_id": document_id
    }