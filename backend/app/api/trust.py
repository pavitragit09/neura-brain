from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.trust_service import TrustSummaryService
from app.schemas.trust import TrustSummaryResponse
from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/trust",
    tags=["Trust Engine"]
)


@router.get("/summary", response_model=TrustSummaryResponse)
def get_trust_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return TrustSummaryService.get_summary(db)
