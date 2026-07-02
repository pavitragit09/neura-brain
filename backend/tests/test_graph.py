from app.agents.graph import (
    build_graph
)

graph = build_graph()

initial_state = {

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

result = graph.invoke(
    initial_state
)

print("\n")
print("=" * 60)
print("FINAL SOP")
print("=" * 60)
print(result["structured_sop"])

print("\n")
print("=" * 60)
print("AGENT LOGS")
print("=" * 60)
print(result["agent_logs"])