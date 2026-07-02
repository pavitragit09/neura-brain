from app.llm.gemini_client import (
    generate_content
)

import json


def l3_structurer(state):

    prompt = f"""
You are an SOP generation engine.

Convert the provided operational rules
into a professional Standard Operating Procedure.

Requirements:

1. Use clear headings.
2. Use numbered steps.
3. Use professional language.
4. Group related rules together.

Rules:

{json.dumps(state["extracted_rules"], indent=2)}
"""

    sop = generate_content(
        prompt
    )

    state["structured_sop"] = sop

    state["agent_logs"].append(
        "L3 Structurer completed"
    )

    return state