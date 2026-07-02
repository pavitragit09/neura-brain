import hashlib
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog

from app.repositories.audit_repository import (
    create_audit_log,
    get_latest_audit_log,
    get_all_audit_logs
    
)


def generate_hash(
    previous_hash: str,
    action: str,
    entity_type: str,
    entity_id: int | None,
    performed_by: str,
    details: str | None
):
    """
    Generates a SHA256 hash for the current audit log.
    """

    data = (
        f"{previous_hash}|"
        f"{action}|"
        f"{entity_type}|"
        f"{entity_id}|"
        f"{performed_by}|"
        f"{details}"
    )

    return hashlib.sha256(
        data.encode("utf-8")
    ).hexdigest()


def log_action(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: int | None = None,
    performed_by: str = "system",
    details: str | None = None
):
    """
    Creates an immutable audit log.
    """

    latest_log = get_latest_audit_log(db)

    previous_hash = (
        latest_log.current_hash
        if latest_log
        else "GENESIS"
    )

    current_hash = generate_hash(
        previous_hash=previous_hash,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        performed_by=performed_by,
        details=details
    )

    audit_log = AuditLog(

        action=action,

        entity_type=entity_type,

        entity_id=entity_id,

        performed_by=performed_by,

        details=details,

        previous_hash=previous_hash,

        current_hash=current_hash
    )

    return create_audit_log(
        db,
        audit_log
    )


def verify_chain(
    db: Session
):
    

    logs = get_all_audit_logs(db)

    if not logs:
        return {
            "valid": True,
            "message": "No audit logs found."
        }

    previous_hash = "GENESIS"

    for log in logs:

        expected_hash = generate_hash(
            previous_hash=previous_hash,
            action=log.action,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            performed_by=log.performed_by,
            details=log.details
        )

        if log.previous_hash != previous_hash:

            return {
                "valid": False,
                "broken_at": log.id,
                "reason": "Previous hash mismatch."
            }

        if log.current_hash != expected_hash:

            return {
                "valid": False,
                "broken_at": log.id,
                "reason": "Current hash mismatch."
            }

        previous_hash = log.current_hash

    return {
        "valid": True,
        "message": "Blockchain audit log verified successfully."
    }