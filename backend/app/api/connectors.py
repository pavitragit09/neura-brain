from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import connector_service
from app.security.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/connectors",
    tags=["Connectors"]
)

@router.get("/google/status")
def get_google_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return connector_service.get_connector_status(db, "google")

@router.post("/google/connect")
def connect_google(
    current_user: User = Depends(get_current_user)
):
    state = connector_service.generate_state_token(current_user.id)
    url = connector_service.generate_google_auth_url(state)
    return {"url": url}

@router.post("/google/disconnect")
def disconnect_google(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = connector_service.disconnect_connector(db, "google")
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Google Drive connector connection not found or already disconnected."
        )
    return {"message": "Disconnected successfully"}
