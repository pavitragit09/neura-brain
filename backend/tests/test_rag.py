from app.services.retrieval_service import (
    answer_question
)

response = answer_question(
    "What hackathons has Pavitra participated in?"
)

print("\nANSWER:\n")

print(
    response["answer"]
)

print("\nSOURCES USED:\n")

for source in response["sources"]:
    print(
        "-" * 50
    )
    print(
        source[:300]
    )