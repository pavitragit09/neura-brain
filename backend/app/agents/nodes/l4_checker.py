import json

from app.llm.gemini_client import (
    generate_content
)


def l4_checker(state):

    prompt = f"""
You are an AI hallucination auditor.

Your task:

Compare the SOP against the original source text.

Identify any claims, dates, policies,
steps, requirements, deadlines,
or instructions that are NOT supported
by the source text.

Return ONLY JSON.

Format:

{{
    "hallucination_score": 0,
    "unsupported_claims": []
}}

Scoring:

0 = completely supported

100 = mostly invented

SOURCE TEXT:

{state["raw_text"]}

GENERATED SOP:

{state["structured_sop"]}
"""

    response = generate_content(
        prompt
    )

    print("\n")
    print("=" * 60)
    print("L4 RAW RESPONSE")
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

        report = json.loads(
            cleaned
        )

        state["hallucination_score"] = (
            report.get(
                "hallucination_score",
                100
            )
        )

        state["hallucination_report"] = (
            report.get(
                "unsupported_claims",
                []
            )
        )

    except Exception as e:

        print(
            f"L4 Parse Error: {e}"
        )

        state["hallucination_score"] = 100

        state["hallucination_report"] = [
            "Unable to validate SOP"
        ]

    state["agent_logs"].append(
        "L4 Hallucination Checker completed"
    )

    return state