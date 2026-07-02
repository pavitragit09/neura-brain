from app.agents.nodes.l3_structurer import (
    l3_structurer
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
            "process": "travel reimbursement",
            "amount": "300/day"
        }
    ],

    "structured_sop": "",

    "contradictions": [],

    "confidence_score": 0,

    "agent_logs": []
}

result = l3_structurer(
    state
)

print(
    result["structured_sop"]
)

print(
    result["agent_logs"]
)