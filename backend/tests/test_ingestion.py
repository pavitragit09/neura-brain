from app.core.database import (
    SessionLocal
)

from app.services.ingestion_service import (
    ingest_pdf
)

db = SessionLocal()

result = ingest_pdf(
    db=db,
    file_path="samples/sample.pdf",
    filename="sample.pdf"
)

print(result)