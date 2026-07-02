from app.parsers.pdf_parser import extract_pdf_text
from app.knowledge.chunking import chunk_text
from app.vectorstore.embeddings import generate_embedding

text = extract_pdf_text(
    "samples/sample.pdf"
)

chunks = chunk_text(text)

print(f"Chunks: {len(chunks)}")

first_chunk = chunks[0]

embedding = generate_embedding(
    first_chunk
)

print(
    f"Embedding dimensions: {len(embedding)}"
)