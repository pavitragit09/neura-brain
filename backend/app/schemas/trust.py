from pydantic import BaseModel


class TrustSummaryResponse(BaseModel):
    verified_assets_count: int
    pending_review_count: int
    failed_ingestion_count: int
    average_confidence: float
    audit_chain_valid: bool
    knowledge_assets: int

    class Config:
        from_attributes = True
