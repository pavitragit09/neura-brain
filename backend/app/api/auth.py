from fastapi import (
    APIRouter,
    Depends
)

from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.core.database import (
    get_db
)

from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse
)

from app.services.auth_service import (
    register_user,
    login_user
)

from app.security.dependencies import (
    get_current_user
)

from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    return register_user(
        db,
        user
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    credentials = UserLogin(
        username=form_data.username,
        password=form_data.password
    )

    return login_user(
        db,
        credentials
    )


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):

    return current_user