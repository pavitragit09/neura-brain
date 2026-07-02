from app.vectorstore.retriever import (
    search_similar_chunks
)

results = search_similar_chunks(
    "mental health detection system"
)

print("\nRESULTS:\n")

for idx, chunk in enumerate(results):

    print(
        f"\n--- Chunk {idx+1} ---\n"
    )

    print(chunk[:500])