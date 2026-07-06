from fastapi import (
    Depends,
    HTTPException,
    status
)

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.core.database import (
    get_db
)

from app.security.jwt import (
    verify_access_token
)

from app.repositories.user_repository import (
    get_user_by_username
)

import os
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    auto_error=False
)

DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    if DEV_MODE:
        user = get_user_by_username(db, "admin")
        if not user:
            user = User(
                id=1,
                username="admin",
                role=UserRole.ADMIN
            )
        else:
            user.role = UserRole.ADMIN
        return user

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    payload = verify_access_token(
        token
    )

    if payload is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    username = payload.get(
        "sub"
    )

    user = get_user_by_username(
        db,
        username
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )

    return user