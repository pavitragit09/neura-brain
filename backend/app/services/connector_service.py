from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import requests
from jose import jwt, JWTError
from app.repositories import connector_repository
from app.core.config import settings
from app.models.connector import Connector

ALGORITHM = "HS256"

def generate_state_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)

def verify_state_token(state_token: str) -> int:
    try:
        payload = jwt.decode(state_token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise ValueError("State payload is missing user ID")
        return user_id
    except JWTError:
        raise ValueError("Invalid or expired OAuth state parameter.")

def get_connector_status(db: Session, connector_type: str):
    conn = connector_repository.get_connector(db, connector_type)
    if conn and conn.connection_status == "connected":
        return {
            "status": "connected",
            "email": conn.provider_email,
            "last_connected": conn.updated_at.isoformat(),
            "connection_health": "healthy",
            "files_indexed": conn.files_indexed,
            "last_sync_at": conn.last_sync_at.isoformat() if conn.last_sync_at else None
        }
    return {"status": "disconnected"}

def generate_google_auth_url(state: str) -> str:
    scopes = [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/drive.metadata.readonly"
    ]
    scope_str = " ".join(scopes)
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        "response_type=code&"
        f"client_id={settings.GOOGLE_CLIENT_ID.strip()}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI.strip()}&"
        f"scope={scope_str}&"
        "access_type=offline&"
        "prompt=consent&"
        f"state={state}"
    )
    return auth_url

def handle_google_callback(db: Session, code: str, user_id: int):
    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID.strip(),
        "client_secret": settings.GOOGLE_CLIENT_SECRET.strip(),
        "redirect_uri": settings.GOOGLE_REDIRECT_URI.strip(),
        "grant_type": "authorization_code"
    }
    
    res = requests.post(token_url, data=payload)
    if res.status_code != 200:
        raise ValueError(f"Failed to exchange Google OAuth code: {res.text}")
        
    token_data = res.json()
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    expires_in = token_data.get("expires_in", 3600)
    expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
    
    # Retrieve user email & account info using userinfo endpoint
    userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo_res = requests.get(userinfo_url, headers=headers)
    if userinfo_res.status_code != 200:
        raise ValueError(f"Failed to fetch Google Userinfo: {userinfo_res.text}")
        
    userinfo = userinfo_res.json()
    provider_account_id = userinfo.get("sub")
    provider_email = userinfo.get("email")
    
    if not provider_account_id or not provider_email:
        raise ValueError("Missing provider profile information from Google OAuth response")
        
    # Store in database with user workspace
    return connector_repository.create_or_update_connector(
        db=db,
        connector_type="google",
        provider_account_id=provider_account_id,
        provider_email=provider_email,
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=expires_at,
        workspace_id=f"workspace_{user_id}"
    )

def refresh_google_access_token(db: Session, connector: Connector) -> Connector:
    if not connector.refresh_token:
        raise ValueError("Refresh token missing for Google Drive connector")
        
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "client_id": settings.GOOGLE_CLIENT_ID.strip(),
        "client_secret": settings.GOOGLE_CLIENT_SECRET.strip(),
        "refresh_token": connector.refresh_token,
        "grant_type": "refresh_token"
    }
    
    res = requests.post(token_url, data=payload)
    if res.status_code != 200:
        raise ValueError(f"Failed to refresh Google access token: {res.text}")
        
    token_data = res.json()
    access_token = token_data.get("access_token")
    expires_in = token_data.get("expires_in", 3600)
    expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
    
    return connector_repository.create_or_update_connector(
        db=db,
        connector_type=connector.connector_type,
        provider_account_id=connector.provider_account_id,
        provider_email=connector.provider_email,
        access_token=access_token,
        refresh_token=connector.refresh_token,
        expires_at=expires_at,
        workspace_id=connector.workspace_id
    )

def disconnect_connector(db: Session, connector_type: str) -> bool:
    # Revoke Google OAuth permissions
    conn = connector_repository.get_connector(db, connector_type)
    if conn and conn.access_token:
        try:
            revoke_url = f"https://oauth2.googleapis.com/revoke?token={conn.access_token}"
            requests.post(revoke_url, timeout=5)
        except Exception:
            pass # ignore token revocation failures to ensure disconnect succeeds
            
    return connector_repository.delete_connector(db, connector_type)
