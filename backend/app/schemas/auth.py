from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class UserRegister(BaseModel):

    username: str

    email: EmailStr

    password: str


class UserLogin(BaseModel):

    username: str

    password: str


class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"


class UserResponse(BaseModel):

    id: int

    username: str

    email: str

    role: UserRole

    class Config:
        from_attributes = True