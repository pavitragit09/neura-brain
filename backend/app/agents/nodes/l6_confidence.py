def l6_confidence(state):

    hallucination_score = state.get(
        "hallucination_score",
        100
    )

    contradictions = state.get(
        "contradictions",
        []
    )

    contradiction_count = len(
        contradictions
    )

    # Base confidence starts high
    confidence = 100

    # Penalize hallucinations
    confidence -= hallucination_score

    # Penalize contradictions heavily
    confidence -= (
        contradiction_count * 20
    )

    confidence = max(
        0,
        min(confidence, 100)
    )

    state["confidence_score"] = (
        confidence
    )

    # Routing Logic

    if (
        hallucination_score <= 20
        and contradiction_count == 0
    ):
        review_status = (
            "AUTO_PUBLISH"
        )

    elif (
        hallucination_score >= 60
        or contradiction_count >= 1
    ):
        review_status = (
            "HUMAN_REVIEW"
        )

    else:
        review_status = (
            "HUMAN_REVIEW"
        )

    state["review_status"] = (
        review_status
    )

    state["agent_logs"].append(
        "L6 Confidence Router completed"
    )

    return state