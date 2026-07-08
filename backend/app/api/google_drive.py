from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.security.dependencies import get_current_user
from app.models.user import User
from app.connectors.google_drive_connector import GoogleDriveConnector

router = APIRouter(
    prefix="/connectors/google",
    tags=["Google Drive Ingestion"]
)

@router.post("/sync")
def sync_google_drive(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Trigger manual ingestion of files from connected Google Drive.
    Only indexed/updated documents are downloaded and parsed.
    """
    try:
        connector = GoogleDriveConnector(db)
        stats = connector.sync(db)
        return stats
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Synchronization failed: {str(e)}"
        )

@router.get("/queue")
def get_queue_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get background ingestion queue metrics for the trust summary and slide-over panels.
    """
    from app.models.ingestion_job import IngestionJob
    
    pending = db.query(IngestionJob).filter(IngestionJob.status == "pending").count()
    pending_retry = db.query(IngestionJob).filter(IngestionJob.status == "pending_retry").count()
    processing = db.query(IngestionJob).filter(IngestionJob.status == "processing").count()
    completed = db.query(IngestionJob).filter(IngestionJob.status == "completed").count()
    failed = db.query(IngestionJob).filter(IngestionJob.status == "failed").count()
    
    return {
        "pending": pending + pending_retry,
        "processing": processing,
        "completed": completed,
        "failed": failed
    }
