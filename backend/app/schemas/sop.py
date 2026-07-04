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


class ContradictionItem(BaseModel):
    id: str
    source_passage: str
    target_passage: str
    description: str
    severity: str


class ContradictionsResponse(BaseModel):
    sop_id: int
    document_name: str
    status: str = "not_available"
    contradictions: list[ContradictionItem] = []


class VerificationStage(BaseModel):
    stage_id: str
    label: str
    status: str  # "pending" | "active" | "completed" | "failed"
    details: str | None = None


class VerificationResponse(BaseModel):
    sop_id: int
    overall_status: str  # "completed" | "pending" | "failed"
    stages: list[VerificationStage]

