from app.agents.nodes.l4_checker import (
    l4_checker
)

state = {

    "raw_text": """
    Refunds above ₹50,000 require manager approval.
    """,

    "chunks": [],

    "retrieved_chunks": [],

    "extracted_rules": [],

    "structured_sop": """
    Refund SOP

    Refunds above ₹50,000 require manager approval.

    Review every 90 days.

    Escalate to finance team.
    """,

    "contradictions": [],

    "confidence_score": 0,

    "hallucination_score": 0,

    "hallucination_report": [],

    "agent_logs": []
}

result = l4_checker(
    state
)

print("\n")
print("=" * 60)
print("HALLUCINATION SCORE")
print("=" * 60)
print(
    result["hallucination_score"]
)

print("\n")
print("=" * 60)
print("UNSUPPORTED CLAIMS")
print("=" * 60)
print(
    result["hallucination_report"]
)

print("\n")
print("=" * 60)
print("AGENT LOGS")
print("=" * 60)
print(
    result["agent_logs"]
)