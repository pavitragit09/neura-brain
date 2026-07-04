from datetime import datetime
from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: int
    action: str
    entity_type: str
    entity_id: int | None = None
    performed_by: str
    details: str | None = None
    previous_hash: str | None = None
    current_hash: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
