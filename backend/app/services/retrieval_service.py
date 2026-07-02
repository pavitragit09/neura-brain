from app.vectorstore.retriever import (
    search_similar_chunks
)

from app.llm.gemini_client import (
    generate_answer
)


def answer_question(
    question: str
):

    chunks = search_similar_chunks(
        question
    )

    context = "\n\n".join(
        chunk["text"]
        for chunk in chunks
    )

    answer = generate_answer(
        question,
        context
    )

    return {
        "answer": answer,
        "sources": [
            {
                "document": chunk["source"],
                "chunk_index": chunk["chunk_index"]
            }
            for chunk in chunks
        ]
    }