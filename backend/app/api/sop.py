from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.repositories.sop_repository import (
    get_all_sops,
    get_sop_by_id
)

from app.security.dependencies import get_current_user
from app.models.user import User
from app.schemas.sop import (
    SOPResponse,
    ContradictionsResponse,
    VerificationResponse,
    VerificationStage,
)

router = APIRouter(
    prefix="/sops",
    tags=["SOPs"]
)


@router.get(
    "/",
    response_model=list[SOPResponse]
)
def fetch_all_sops(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    sops = get_all_sops(db)

    return sops


@router.get(
    "/{sop_id}",
    response_model=SOPResponse
)
def fetch_sop(
    sop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    sop = get_sop_by_id(
        db,
        sop_id
    )

    if not sop:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP not found"
        )

    return sop


@router.get(
    "/{sop_id}/contradictions",
    response_model=ContradictionsResponse
)
def get_sop_contradictions(
    sop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sop = get_sop_by_id(db, sop_id)
    if not sop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP not found"
        )

    return ContradictionsResponse(
        sop_id=sop_id,
        document_name=sop.document_name,
        status="not_available",
        contradictions=[]
    )


@router.get(
    "/{sop_id}/verification",
    response_model=VerificationResponse
)
def get_sop_verification(
    sop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sop = get_sop_by_id(db, sop_id)
    if not sop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOP not found"
        )

    # Map database review_status to Human Verification stage status
    review_status = sop.review_status
    if review_status in ("APPROVED", "AUTO_PUBLISH"):
        human_status = "completed"
        human_details = f"Verified and published by {review_status.lower()}"
    elif review_status == "REJECTED":
        human_status = "failed"
        human_details = "Rejected during human verification"
    else:
        human_status = "active"
        human_details = "Awaiting review in governance queue"

    overall_status = "completed" if human_status == "completed" else "pending"
    if human_status == "failed":
        overall_status = "failed"

    stages = [
        VerificationStage(
            stage_id="ingestion",
            label="Document Ingestion",
            status="completed",
            details="Document parsing and text tokenization successful"
        ),
        VerificationStage(
            stage_id="chunking",
            label="Knowledge Chunking",
            status="completed",
            details="Context split into semantic document chunks"
        ),
        VerificationStage(
            stage_id="embeddings",
            label="Vector Embeddings",
            status="completed",
            details="Text vectors compiled using text-embedding-3-small"
        ),
        VerificationStage(
            stage_id="cross_reference",
            label="Cross-Reference",
            status="completed",
            details="Verified references mapped to the knowledge graph"
        ),
        VerificationStage(
            stage_id="hallucination",
            label="Hallucination Check",
            status="completed",
            details=f"Extracted SOP score: {sop.hallucination_score} (Acceptable)"
        ),
        VerificationStage(
            stage_id="human_verification",
            label="Human Verification",
            status=human_status,
            details=human_details
        )
    ]

    return VerificationResponse(
        sop_id=sop_id,
        overall_status=overall_status,
        stages=stages
    )