from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    question: str = Field(min_length=1)


class SearchSourceResponse(BaseModel):
    document: str
    chunk_index: int
    excerpt: str | None = None


class RelatedKnowledgeResponse(BaseModel):
    id: str
    title: str
    source: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[SearchSourceResponse]
    confidence_score: float
    source_count: int
    follow_up_questions: list[str]
    related_knowledge: list[RelatedKnowledgeResponse]
