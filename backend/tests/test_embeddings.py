from app.vectorstore.embeddings import generate_embedding

vector = generate_embedding(
    "Refunds above 50000 require manager approval."
)

print(type(vector))

print(len(vector))

print(vector[:10])