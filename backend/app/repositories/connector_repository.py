from sqlalchemy.orm import Session
from datetime import datetime
from app.models.connector import Connector
from app.security.encryption import encrypt_token, decrypt_token

def get_connector(db: Session, connector_type: str) -> Connector | None:
    connector = db.query(Connector).filter(Connector.connector_type == connector_type).first()
    if connector:
        # Decrypt stored tokens for service layers
        connector.access_token = decrypt_token(connector.access_token)
        if connector.refresh_token:
            connector.refresh_token = decrypt_token(connector.refresh_token)
    return connector

def create_or_update_connector(
    db: Session,
    connector_type: str,
    provider_account_id: str,
    provider_email: str,
    access_token: str,
    refresh_token: str | None = None,
    expires_at: datetime | None = None,
    workspace_id: str = "default"
) -> Connector:
    enc_access = encrypt_token(access_token)
    enc_refresh = encrypt_token(refresh_token) if refresh_token else None

    connector = db.query(Connector).filter(Connector.connector_type == connector_type).first()
    if not connector:
        connector = Connector(
            connector_type=connector_type,
            provider_account_id=provider_account_id,
            provider_email=provider_email,
            access_token=enc_access,
            refresh_token=enc_refresh,
            expires_at=expires_at,
            workspace_id=workspace_id,
            connection_status="connected"
        )
        db.add(connector)
    else:
        connector.provider_account_id = provider_account_id
        connector.provider_email = provider_email
        connector.access_token = enc_access
        if enc_refresh:
            connector.refresh_token = enc_refresh
        if expires_at:
            connector.expires_at = expires_at
        connector.workspace_id = workspace_id
        connector.connection_status = "connected"
        connector.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(connector)
    
    # Decrypt properties on the returned instance
    connector.access_token = decrypt_token(connector.access_token)
    if connector.refresh_token:
        connector.refresh_token = decrypt_token(connector.refresh_token)
    return connector

def delete_connector(db: Session, connector_type: str) -> bool:
    connector = db.query(Connector).filter(Connector.connector_type == connector_type).first()
    if connector:
        db.delete(connector)
        db.commit()
        return True
    return False
