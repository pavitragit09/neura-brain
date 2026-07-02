from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.core.database import (
    get_db
)

from app.repositories.document_repository import (
    get_all_documents,
    get_document_by_id
)

from app.repositories.sop_repository import (
    get_sop_by_id
)

from app.services.document_service import (
    delete_document
)

from app.security.dependencies import (
    get_current_user
)

from app.models.user import User


from app.schemas.document import (
    DeleteDocumentResponse,
    DocumentResponse
)
from app.schemas.sop import SOPResponse


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.get(
    "/",
    response_model=list[DocumentResponse]
)
def fetch_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_all_documents(
        db
    )


@router.get(
    "/{document_id}",
    response_model=DocumentResponse
)
def fetch_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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

    return document


@router.get(
    "/{document_id}/sop",
    response_model=SOPResponse
)
def fetch_document_sop(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
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

    sop = get_sop_by_id(
        db,
        document.sop_id
    )

    if not sop:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP not found."
        )

    return sop


@router.delete(
    "/{document_id}",
    response_model=DeleteDocumentResponse
)
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return delete_document(
        db=db,
        document_id=document_id,
        performed_by=current_user.username
    )