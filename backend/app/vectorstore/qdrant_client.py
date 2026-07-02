from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams
)

from app.core.config import settings

client = QdrantClient(
    url=settings.QDRANT_URL
)


def create_collection():

    collections = client.get_collections()

    names = [
        c.name
        for c in collections.collections
    ]

    if settings.COLLECTION_NAME not in names:

        client.create_collection(
            collection_name=settings.COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )

        print("Collection created")

    else:
        print("Collection already exists")