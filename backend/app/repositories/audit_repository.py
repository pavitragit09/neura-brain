from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    audit_log: AuditLog
):

    db.add(audit_log)

    db.commit()

    db.refresh(audit_log)

    return audit_log


def get_latest_audit_log(
    db: Session
):

    return (
        db.query(AuditLog)
        .order_by(AuditLog.id.desc())
        .first()
    )


def get_all_audit_logs(
    db: Session
):

    return (
        db.query(AuditLog)
        .order_by(AuditLog.id.asc())
        .all()
    )