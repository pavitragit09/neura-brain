from app.parsers.pdf_parser import extract_pdf_text

text = extract_pdf_text(
    "samples/sample.pdf"
)

print(text[:2000])