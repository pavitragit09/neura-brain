from app.agents.nodes.l2_relevance import (
    l2_relevance
)

state = {

    "raw_text": "",

    "chunks": [],

    "retrieved_chunks": [],

    "extracted_rules": [
        {
            "process": "refund",
            "condition": "amount > 50000",
            "action": "manager approval"
        },
        {
            "message":
            "Happy Birthday Sarah"
        },
        {
            "process":
            "travel reimbursement",
            "amount": "300/day"
        }
    ],

    "structured_sop": "",

    "contradictions": [],

    "confidence_score": 0,

    "agent_logs": []
}

result = l2_relevance(
    state
)

print(
    result["extracted_rules"]
)

print(
    result["agent_logs"]
)