from app.services.audit_service import log_action
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings

from app.services.ingestion_service import (
    ingest_pdf
)

from app.security.rbac import require_roles
from app.models.user import UserRole, User
from app.schemas.upload import UploadResponse


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

settings.UPLOAD_DIR.mkdir(
    exist_ok=True
)


@router.post(
    "/",
    response_model=UploadResponse
)
def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.EMPLOYEE
        )
    )
):

    if not file.filename.endswith(".pdf"):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    file_path = (
        settings.UPLOAD_DIR / file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    result = ingest_pdf(
        db=db,
        file_path=str(file_path),
        filename=file.filename
    )

    log_action(
        db=db,
        action="UPLOAD",
        entity_type="DOCUMENT",
        entity_id=result.get("document_id"),
        performed_by=current_user.username,
        details=f"Uploaded {file.filename}"
    )

    return {
        "message": "Document processed successfully",
        "result": result
    }