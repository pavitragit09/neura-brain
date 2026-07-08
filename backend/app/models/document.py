from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.core.database import Base


class Document(Base):

    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    source_type = Column(
        String,
        default="pdf"
    )

    processing_status = Column(
        String,
        default="completed"
    )

    sop_id = Column(
        Integer,
        ForeignKey("sops.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    google_file_id = Column(
        String,
        nullable=True,
        index=True
    )

    google_modified_time = Column(
        DateTime,
        nullable=True
    )

    google_web_view_link = Column(
        String,
        nullable=True
    )

    sop = relationship(
        "SOP",
        back_populates="document"
    )