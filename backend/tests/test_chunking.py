from app.parsers.pdf_parser import extract_pdf_text
from app.knowledge.chunking import chunk_text

text = extract_pdf_text(
    "samples/sample.pdf"
)

chunks = chunk_text(text)

print(f"Total chunks: {len(chunks)}")

print("\nFIRST CHUNK:\n")
print(chunks[0])

print("\nSECOND CHUNK:\n")
print(chunks[1])