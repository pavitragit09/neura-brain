from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.document import Document
from app.models.sop import SOP
from app.services.audit_service import verify_chain
from app.schemas.trust import TrustSummaryResponse


class TrustSummaryService:
    @staticmethod
    def get_summary(db: Session) -> TrustSummaryResponse:
        # 1. Connected/Verified assets (SOP review_status == APPROVED or AUTO_PUBLISH)
        verified_count = (
            db.query(SOP)
            .filter(SOP.review_status.in_(["APPROVED", "AUTO_PUBLISH"]))
            .count()
        )

        # 2. Pending human review assets (SOP review_status == HUMAN_REVIEW or PENDING)
        pending_count = (
            db.query(SOP)
            .filter(SOP.review_status.in_(["HUMAN_REVIEW", "PENDING"]))
            .count()
        )

        # 3. Failed processing/ingestion count
        failed_count = (
            db.query(Document)
            .filter(Document.processing_status == "failed")
            .count()
        )

        # 4. Average confidence score
        avg_conf_query = db.query(func.avg(SOP.confidence_score)).scalar()
        avg_confidence = float(avg_conf_query) if avg_conf_query is not None else 0.0

        # 5. Cryptographic audit logs chain verification status
        audit_result = verify_chain(db)
        audit_chain_valid = audit_result.get("valid", True)

        # 6. Total successful knowledge assets indexed
        assets_count = (
            db.query(Document)
            .filter(Document.processing_status == "completed")
            .count()
        )

        return TrustSummaryResponse(
            verified_assets_count=verified_count,
            pending_review_count=pending_count,
            failed_ingestion_count=failed_count,
            average_confidence=round(avg_confidence, 2),
            audit_chain_valid=audit_chain_valid,
            knowledge_assets=assets_count
        )
