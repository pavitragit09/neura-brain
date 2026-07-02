from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.repositories.sop_repository import (
    update_review_status
)

from app.security.rbac import require_roles

from app.models.user import UserRole, User


router = APIRouter(
    prefix="/review",
    tags=["Review Workflow"]
)


@router.patch("/{sop_id}/approve")
def approve_sop(
    sop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.REVIEWER
        )
    )
):

    sop = update_review_status(
        db,
        sop_id,
        "APPROVED"
    )

    if not sop:

        return {
            "error": "SOP not found"
        }

    return {
        "message": "SOP approved",
        "sop_id": sop.id,
        "status": sop.review_status
    }


@router.patch("/{sop_id}/reject")
def reject_sop(
    sop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.REVIEWER
        )
    )
):

    sop = update_review_status(
        db,
        sop_id,
        "REJECTED"
    )

    if not sop:

        return {
            "error": "SOP not found"
        }

    return {
        "message": "SOP rejected",
        "sop_id": sop.id,
        "status": sop.review_status
    }