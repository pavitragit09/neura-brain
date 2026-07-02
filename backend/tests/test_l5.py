from app.agents.nodes.l5_contradiction import (
    l5_contradiction
)

state = {

    "raw_text": "",

    "chunks": [],

    "retrieved_chunks": [],

    "extracted_rules": [
        {
            "process": "intern travel",
            "amount": "350/day"
        }
    ],

    "structured_sop": "",

    "contradictions": [],

    "contradiction_report": [],

    "hallucination_score": 0,

    "hallucination_report": [],

    "confidence_score": 0,

    "agent_logs": []
}

result = l5_contradiction(
    state
)

print("\n")
print("=" * 60)
print("CONTRADICTIONS")
print("=" * 60)
print(result["contradictions"])

print("\n")
print("=" * 60)
print("AGENT LOGS")
print("=" * 60)
print(result["agent_logs"])