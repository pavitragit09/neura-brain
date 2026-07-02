from app.agents.graph import (
    build_graph
)

graph = build_graph()

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

    "contradiction_report": [],

    "hallucination_report": [],

    "hallucination_score": 0,

    "confidence_score": 0,

    "review_status": "",

    "agent_logs": []
}

result = graph.invoke(
    state
)

print("\nFINAL STATUS:")
print(result["review_status"])

print("\nCONFIDENCE:")
print(result["confidence_score"])

print("\nHALLUCINATION SCORE:")
print(result["hallucination_score"])

print("\nCONTRADICTIONS:")
print(result["contradictions"])

print("\nLOGS:")
print(result["agent_logs"])