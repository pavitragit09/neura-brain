from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.audit_service import (
    verify_chain
)
from app.repositories.audit_repository import (
    get_all_audit_logs
)
from app.schemas.audit import AuditLogResponse
from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/audit",
    tags=["Audit"]
)


@router.get("/verify")
def verify_audit_chain(
    db: Session = Depends(get_db)
):

    return verify_chain(db)


@router.get("/logs", response_model=list[AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_audit_logs(db)