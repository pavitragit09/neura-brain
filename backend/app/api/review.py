from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.repositories.sop_repository import (
    update_review_status,
    get_all_sops,
)

from app.security.rbac import require_roles
from app.security.dependencies import get_current_user
from app.schemas.sop import SOPResponse
from app.models.user import UserRole, User


from app.services.audit_service import log_action

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

    log_action(
        db=db,
        action="APPROVE_SOP",
        entity_type="SOP",
        entity_id=sop_id,
        performed_by=current_user.username,
        details=f"Approved SOP for {sop.document_name}"
    )

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

    log_action(
        db=db,
        action="REJECT_SOP",
        entity_type="SOP",
        entity_id=sop_id,
        performed_by=current_user.username,
        details=f"Rejected SOP for {sop.document_name}"
    )

    return {
        "message": "SOP rejected",
        "sop_id": sop.id,
        "status": sop.review_status
    }


@router.get("/pending", response_model=list[SOPResponse])
def get_pending_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sops = get_all_sops(db)
    return [s for s in sops if s.review_status in ("HUMAN_REVIEW", "PENDING")]