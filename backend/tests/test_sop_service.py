from app.core.database import (
    SessionLocal
)

from app.services.sop_service import (
    process_document
)

db = SessionLocal()

sample_text = """
Refunds above ₹50,000 require manager approval.

Intern travel reimbursement is ₹300/day.

Employees must submit receipts.
"""

result = process_document(
    db=db,
    document_name="policy.pdf",
    document_text=sample_text
)

print("\nDATABASE ID:")
print(
    result["database_id"]
)

print("\nSTATUS:")
print(
    result["result"]["review_status"]
)

print("\nCONFIDENCE:")
print(
    result["result"]["confidence_score"]
)