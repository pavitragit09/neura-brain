from app.llm.gemini_client import (
    generate_content
)

import json


def l2_relevance(state):

    prompt = f"""
You are a company knowledge filter.

Your task is to keep ONLY operational rules,
policies, procedures, approvals, workflows,
compliance requirements, and SOP-related information.

Remove anything irrelevant.

Return ONLY JSON.

Rules:

{json.dumps(state["extracted_rules"], indent=2)}
"""

    response = generate_content(
        prompt
    )

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

        filtered_rules = json.loads(
            cleaned
        )

    except Exception:

        filtered_rules = state[
            "extracted_rules"
        ]

    state["extracted_rules"] = (
        filtered_rules
    )

    state["agent_logs"].append(
        "L2 Relevance completed"
    )

    return state