from fastapi import FastAPI
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
Base.metadata.create_all(
    bind=engine
)
app = FastAPI(
    title="Company Brain MVP"
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