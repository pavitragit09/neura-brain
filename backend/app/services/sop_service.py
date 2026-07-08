from app.agents.graph import (
    build_graph
)

from app.repositories.sop_repository import (
    create_sop
)

from app.repositories.document_repository import (
    create_document
)
graph = build_graph()


def generate_sop_data(document_text: str) -> dict:
    initial_state = {
        "raw_text": document_text,
        "chunks": [],
        "retrieved_chunks": [],
        "extracted_rules": [],
        "structured_sop": "",
        "contradictions": [],
        "contradiction_report": [],
        "hallucination_report": [],
        "hallucination_score": 0,
        "confidence_score": 0,
        "review_status": "",
        "agent_logs": []
    }
    return graph.invoke(initial_state)

def process_document(
    db,
    document_name: str,
    document_text: str
):
    result = generate_sop_data(document_text)

    saved_sop = create_sop(
        db=db,
        document_name=document_name,
        structured_sop=result["structured_sop"],
        hallucination_score=result["hallucination_score"],
        confidence_score=result["confidence_score"],
        review_status=result["review_status"]
    )
    saved_document = create_document(
        db=db,
        filename=document_name,
        sop_id=saved_sop.id
    )

    return {
        "sop_id": saved_sop.id,
        "document_id": saved_document.id,
        "result": result
    }