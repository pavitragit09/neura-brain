from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import (
    engine,
    Base
)

# IMPORTANT
from app.models.audit_log import AuditLog
from app.models.user import User
from app.models.sop import SOP
from app.models.document import Document
from app.api.sop import (
    router as sop_router
)
from app.api.upload import (
    router as upload_router
)
from app.api.auth import (
    router as auth_router
)
from app.api.query import (
    router as query_router
)
from app.api.document import (
    router as document_router
)
from app.api.review import (
    router as review_router
)
from app.api.audit import (
    router as audit_router
)
from app.api.trust import (
    router as trust_router
)
from fastapi.staticfiles import StaticFiles
from app.core.config import settings

Base.metadata.create_all(
    bind=engine
)
app = FastAPI(
    title="Company Brain MVP"
)

# Ensure upload directory exists and mount static path
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory=str(settings.UPLOAD_DIR)),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex="https?://(localhost|127\\.0\\.0\\.1|192\\.168\\.\\d+\\.\\d+|10\\.\\d+\\.\\d+\\.\\d+|172\\.(1[6-9]|2\\d|3[0-1])\\.\\d+\\.\\d+)(:\\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():

    return {
        "status": "running"
    }


app.include_router(
    sop_router
)

app.include_router(
    upload_router
)
app.include_router(
    query_router
)
app.include_router(
    document_router
)
app.include_router(
    review_router
)
app.include_router(
    auth_router
)
app.include_router(
    audit_router
)
app.include_router(
    trust_router
)