from fastapi import APIRouter

from app.schemas.query import QueryRequest, QueryResponse, RelatedKnowledgeResponse, SearchSourceResponse
from app.services.retrieval_service import answer_question

router = APIRouter(
    prefix="/query",
    tags=["Search"],
)


def _build_follow_up_questions(question: str) -> list[str]:
    return [
        "Who approved this policy?",
        "Has this changed recently?",
        "Show previous versions.",
        "Which departments are affected?",
    ]


def _build_related_knowledge(sources: list[dict]) -> list[RelatedKnowledgeResponse]:
    related: list[RelatedKnowledgeResponse] = []

    for index, source in enumerate(sources[:5]):
        document_name = source.get("document", "Knowledge source")
        related.append(
            RelatedKnowledgeResponse(
                id=f"related-{index}",
                title=document_name,
                source="Indexed knowledge",
            )
        )

    return related


@router.post(
    "/",
    response_model=QueryResponse,
)
def query_knowledge(payload: QueryRequest):
    result = answer_question(payload.question)
    sources = result.get("sources", [])
    source_items = [
        SearchSourceResponse(
            document=source["document"],
            chunk_index=source["chunk_index"],
            excerpt=source.get("excerpt"),
        )
        for source in sources
    ]

    confidence_score = 0.96 if sources else 0.0

    return QueryResponse(
        answer=result["answer"],
        sources=source_items,
        confidence_score=confidence_score,
        source_count=len(source_items),
        follow_up_questions=_build_follow_up_questions(payload.question),
        related_knowledge=_build_related_knowledge(sources),
    )
