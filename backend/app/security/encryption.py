import base64
import hashlib
from cryptography.fernet import Fernet
from app.core.config import settings

def _get_fernet() -> Fernet:
    # Derive a consistent 32-byte key from SECRET_KEY
    derived = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    key = base64.urlsafe_b64encode(derived)
    return Fernet(key)

def encrypt_token(token: str | None) -> str | None:
    if not token:
        return token
    f = _get_fernet()
    return f.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str | None) -> str | None:
    if not encrypted_token:
        return encrypted_token
    f = _get_fernet()
    try:
        return f.decrypt(encrypted_token.encode()).decode()
    except Exception:
        # Fallback to plain text if the token is not encrypted (e.g. mock tokens)
        return encrypted_token
