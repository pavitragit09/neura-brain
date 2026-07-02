from datetime import datetime, timedelta
from jose import jwt, JWTError

from app.core.config import settings

ALGORITHM = "HS256"


def create_access_token(
    data: dict,
    expires_delta: timedelta = timedelta(hours=24)
):
    to_encode = data.copy()

    expire = datetime.utcnow() + expires_delta

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_access_token(
    token: str
):

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None