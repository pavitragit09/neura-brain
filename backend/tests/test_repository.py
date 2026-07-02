from app.core.database import (
    SessionLocal
)

from app.repositories.sop_repository import (
    create_sop,
    get_all_sops
)

db = SessionLocal()

create_sop(
    db=db,
    document_name="sample.pdf",
    structured_sop="This is a test SOP",
    hallucination_score=15,
    confidence_score=85,
    review_status="AUTO_PUBLISH"
)

all_sops = get_all_sops(
    db
)

print("\nSOPS IN DATABASE:\n")

for sop in all_sops:

    print(
        sop.id,
        sop.document_name,
        sop.review_status
    )