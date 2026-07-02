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
from app.schemas.sop import SOPResponse

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