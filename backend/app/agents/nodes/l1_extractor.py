import json

from app.llm.gemini_client import (
    generate_content
)


def l1_extractor(state):

    prompt = f"""
You are a business rule extraction engine.

Your task is to extract operational business rules from the provided text.

Return ONLY valid JSON.

Examples:

Input:
Refunds above ₹50,000 require manager approval.

Output:
[
  {{
    "process": "refund",
    "condition": "amount > 50000",
    "action": "manager approval"
  }}
]

Input:
Intern travel reimbursement is ₹300/day.

Output:
[
  {{
    "process": "intern travel",
    "amount": "300/day"
  }}
]

If no operational rules exist, return:

[]

Text:

{state["raw_text"]}
"""

    response = generate_content(prompt)

    print("\n" + "=" * 60)
    print("RAW GEMINI RESPONSE")
    print("=" * 60)
    print(response)
    print("=" * 60 + "\n")

    try:

        cleaned_response = response.strip()

        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response.replace(
                "```json",
                ""
            )

        if cleaned_response.startswith("```"):
            cleaned_response = cleaned_response.replace(
                "```",
                ""
            )

        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3]

        cleaned_response = cleaned_response.strip()

        print("\nCLEANED RESPONSE:\n")
        print(cleaned_response)

        rules = json.loads(
            cleaned_response
        )

    except Exception as e:

        print("\nJSON PARSE ERROR:\n")
        print(e)

        rules = []

    state["extracted_rules"] = rules

    state["agent_logs"].append(
        "L1 Extractor completed"
    )

    return state