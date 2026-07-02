from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime
)

from datetime import datetime

from app.core.database import Base

from sqlalchemy.orm import relationship
class SOP(Base):

    __tablename__ = "sops"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_name = Column(
        String,
        nullable=False
    )

    structured_sop = Column(
        Text,
        nullable=False
    )

    hallucination_score = Column(
        Float,
        default=0
    )

    confidence_score = Column(
        Float,
        default=0
    )

    review_status = Column(
        String,
        default="HUMAN_REVIEW"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    document = relationship(
    "Document",
    back_populates="sop",
    uselist=False
    )