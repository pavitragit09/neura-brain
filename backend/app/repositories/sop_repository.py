from sqlalchemy.orm import Session

from app.models.sop import SOP


def create_sop(
    db: Session,
    document_name: str,
    structured_sop: str,
    hallucination_score: float,
    confidence_score: float,
    review_status: str
):

    sop = SOP(
        document_name=document_name,
        structured_sop=structured_sop,
        hallucination_score=hallucination_score,
        confidence_score=confidence_score,
        review_status=review_status
    )

    db.add(sop)

    db.commit()

    db.refresh(sop)

    return sop


def get_sop_by_id(
    db: Session,
    sop_id: int
):

    return (
        db.query(SOP)
        .filter(SOP.id == sop_id)
        .first()
    )


def get_all_sops(
    db: Session
):

    return (
        db.query(SOP)
        .order_by(SOP.id.desc())
        .all()
    )


def update_review_status(
    db: Session,
    sop_id: int,
    new_status: str
):

    sop = (
        db.query(SOP)
        .filter(SOP.id == sop_id)
        .first()
    )

    if not sop:
        return None

    sop.review_status = new_status

    db.commit()

    db.refresh(sop)

    return sop
def delete_sop(
    db: Session,
    sop: SOP
):

    db.delete(sop)

    db.commit()