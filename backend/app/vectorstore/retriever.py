from qdrant_client.models import PointStruct
import uuid

from app.vectorstore.qdrant_client import client
from app.core.config import settings
from app.vectorstore.embeddings import (
    generate_embedding
)
from qdrant_client.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue
)

def store_chunks(
    chunks,
    embeddings,
    document_name
):

    points = []

    for idx, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": chunk,
                    "source": document_name,
                    "chunk_index": idx
                }
            )
        )

    client.upsert(
        collection_name=settings.COLLECTION_NAME,
        points=points
    )

    print(
        f"{len(points)} chunks stored."
    )


def search_similar_chunks(
    query: str,
    limit: int = 5
):

    query_vector = generate_embedding(
        query
    )

    results = client.query_points(
        collection_name=settings.COLLECTION_NAME,
        query=query_vector,
        limit=limit
    )

    retrieved_chunks = []

    for point in results.points:

        payload = point.payload or {}

        retrieved_chunks.append(
            {
                "text": payload.get(
                    "text",
                    ""
                ),
                "source": payload.get(
                    "source",
                    "unknown_document"
                ),
                "chunk_index": payload.get(
                    "chunk_index",
                    -1
                )
            }
        )

    return retrieved_chunks

def delete_document_chunks(
    document_name: str
):
    """
    Deletes all vectors belonging to a document.
    """

    client.delete(
        collection_name=settings.COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="source",
                    match=MatchValue(
                        value=document_name
                    )
                )
            ]
        )
    )

    print(
        f"Deleted vectors for {document_name}"
    )