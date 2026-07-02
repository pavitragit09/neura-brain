import json

from app.llm.gemini_client import (
    generate_content
)


def l5_contradiction(state):

    existing_rules = [
        {
            "process": "intern travel",
            "amount": "300/day"
        },
        {
            "process": "refund",
            "condition": "amount > 50000",
            "action": "manager approval"
        }
    ]

    prompt = f"""
You are a contradiction detection engine.

Compare NEW RULES against EXISTING RULES.

Identify conflicts.

Return ONLY JSON.

Format:

[
  {{
    "process": "",
    "field": "",
    "old_value": "",
    "new_value": ""
  }}
]

EXISTING RULES:

{json.dumps(existing_rules, indent=2)}

NEW RULES:

{json.dumps(state["extracted_rules"], indent=2)}
"""

    response = generate_content(
        prompt
    )

    print("\n")
    print("=" * 60)
    print("L5 RAW RESPONSE")
    print("=" * 60)
    print(response)

    try:

        cleaned = response.strip()

        if cleaned.startswith("```json"):
            cleaned = cleaned.replace(
                "```json",
                ""
            )

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        cleaned = cleaned.strip()

        contradictions = json.loads(
            cleaned
        )

    except Exception as e:

        print(
            f"L5 Parse Error: {e}"
        )

        contradictions = []

    state["contradictions"] = (
        contradictions
    )

    state["contradiction_report"] = (
        contradictions
    )

    state["agent_logs"].append(
        "L5 Contradiction Detector completed"
    )

    return state