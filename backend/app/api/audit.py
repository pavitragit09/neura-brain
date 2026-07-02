from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.audit_service import (
    verify_chain
)

router = APIRouter(
    prefix="/audit",
    tags=["Audit"]
)


@router.get("/verify")
def verify_audit_chain(
    db: Session = Depends(get_db)
):

    return verify_chain(db)