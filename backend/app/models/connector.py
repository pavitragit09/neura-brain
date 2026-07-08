from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class Connector(Base):
    __tablename__ = "connectors"

    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(String, default="default", nullable=True)
    connector_type = Column(String, nullable=False) # e.g. "google", "slack", "notion"
    provider_account_id = Column(String, nullable=True)
    provider_email = Column(String, nullable=True)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    connection_status = Column(String, default="connected")
    
    # Extended sync tracking fields
    last_sync_at = Column(DateTime, nullable=True)
    last_sync_status = Column(String, nullable=True)
    last_error = Column(String, nullable=True)
    sync_frequency = Column(String, default="manual")
    files_indexed = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
