from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User

from app.repositories.user_repository import (
    create_user,
    get_user_by_email,
    get_user_by_username
)

from app.security.hashing import (
    hash_password,
    verify_password
)

from app.security.jwt import (
    create_access_token
)

from app.schemas.auth import (
    UserRegister,
    UserLogin
)


def register_user(
    db: Session,
    user_data: UserRegister
):

    if get_user_by_username(
        db,
        user_data.username
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists."
        )

    if get_user_by_email(
        db,
        user_data.email
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists."
        )

    user = User(

        username=user_data.username,

        email=user_data.email,

        hashed_password=hash_password(
            user_data.password
        )

    )

    return create_user(
        db,
        user
    )


def login_user(
    db: Session,
    credentials: UserLogin
):

    user = get_user_by_username(
        db,
        credentials.username
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    if not verify_password(
        credentials.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    token = create_access_token(
        {
            "sub": user.username,
            "role": user.role.value,
            "user_id": user.id
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }