from datetime import datetime

from pydantic import BaseModel


class SOPResponse(BaseModel):

    id: int

    document_name: str

    structured_sop: str

    hallucination_score: float

    confidence_score: float

    review_status: str

    created_at: datetime

    class Config:
        from_attributes = True
