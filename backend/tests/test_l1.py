from app.agents.nodes.l1_extractor import (
    l1_extractor
)

state = {
    "raw_text": """
    Refunds above ₹50,000 require manager approval.

    Intern travel reimbursement is ₹300/day.

    Employees must submit receipts.
    """,

    "chunks": [],
    "retrieved_chunks": [],
    "extracted_rules": [],
    "structured_sop": "",
    "contradictions": [],
    "confidence_score": 0,
    "agent_logs": []
}

result = l1_extractor(
    state
)

print(
    result["extracted_rules"]
)

print(
    result["agent_logs"]
)