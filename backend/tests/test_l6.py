from app.agents.nodes.l6_confidence import (
    l6_confidence
)

state = {

    "raw_text": "",

    "chunks": [],

    "retrieved_chunks": [],

    "extracted_rules": [],

    "structured_sop": "",

    "contradictions": [
        {
            "process": "intern travel",
            "field": "amount",
            "old_value": "300/day",
            "new_value": "350/day"
        }
    ],

    "contradiction_report": [],

    "hallucination_score": 70,

    "hallucination_report": [],

    "confidence_score": 0,

    "review_status": "",

    "agent_logs": []
}

result = l6_confidence(
    state
)

print("\n")
print("=" * 60)
print("CONFIDENCE")
print("=" * 60)
print(
    result["confidence_score"]
)

print("\n")
print("=" * 60)
print("STATUS")
print("=" * 60)
print(
    result["review_status"]
)

print("\n")
print("=" * 60)
print("LOGS")
print("=" * 60)
print(
    result["agent_logs"]
)