from langgraph.graph import (
    StateGraph,
    END
)

from app.agents.state import (
    BrainState
)

# L1
from app.agents.nodes.l1_extractor import (
    l1_extractor
)

# L2
from app.agents.nodes.l2_relevance import (
    l2_relevance
)

# L3
from app.agents.nodes.l3_structurer import (
    l3_structurer
)

# L4
from app.agents.nodes.l4_checker import (
    l4_checker
)

# L5
from app.agents.nodes.l5_contradiction import (
    l5_contradiction
)

# L6
from app.agents.nodes.l6_confidence import (
    l6_confidence
)


def build_graph():

    workflow = StateGraph(
        BrainState
    )

    # =====================
    # Nodes
    # =====================

    workflow.add_node(
        "l1_extractor",
        l1_extractor
    )

    workflow.add_node(
        "l2_relevance",
        l2_relevance
    )

    workflow.add_node(
        "l3_structurer",
        l3_structurer
    )

    workflow.add_node(
        "l4_checker",
        l4_checker
    )

    workflow.add_node(
        "l5_contradiction",
        l5_contradiction
    )

    workflow.add_node(
        "l6_confidence",
        l6_confidence
    )

    # =====================
    # Entry Point
    # =====================

    workflow.set_entry_point(
        "l1_extractor"
    )

    # =====================
    # Flow
    # =====================

    workflow.add_edge(
        "l1_extractor",
        "l2_relevance"
    )

    workflow.add_edge(
        "l2_relevance",
        "l3_structurer"
    )

    workflow.add_edge(
        "l3_structurer",
        "l4_checker"
    )

    workflow.add_edge(
        "l4_checker",
        "l5_contradiction"
    )

    workflow.add_edge(
        "l5_contradiction",
        "l6_confidence"
    )

    workflow.add_edge(
        "l6_confidence",
        END
    )

    return workflow.compile()