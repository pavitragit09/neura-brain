from app.parsers.pdf_parser import extract_pdf_text
from app.knowledge.chunking import chunk_text

from app.vectorstore.embeddings import (
    generate_embedding
)

from app.vectorstore.retriever import (
    store_chunks
)

text = extract_pdf_text(
    "samples/sample.pdf"
)

chunks = chunk_text(text)

embeddings = [
    generate_embedding(chunk)
    for chunk in chunks
]

store_chunks(
    chunks,
    embeddings
)