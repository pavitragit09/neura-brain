from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):

    id: int

    filename: str

    source_type: str

    processing_status: str

    sop_id: int

    created_at: datetime

    class Config:
        from_attributes = True


class DeleteDocumentResponse(BaseModel):

    message: str

    document_id: int
