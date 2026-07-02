from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum
)

from datetime import datetime

from enum import Enum as PyEnum

from app.core.database import Base


class UserRole(PyEnum):

    ADMIN = "ADMIN"

    REVIEWER = "REVIEWER"

    EMPLOYEE = "EMPLOYEE"


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    role = Column(
        Enum(UserRole),
        default=UserRole.EMPLOYEE,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )