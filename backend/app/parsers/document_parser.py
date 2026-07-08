import docx
from pypdf import PdfReader

def extract_text_from_file(file_path: str, file_extension: str) -> str:
    """
    Extract text content from a file based on its extension.
    Supports: .pdf, .docx, .txt, .md
    """
    ext = file_extension.lower().strip()
    if ext == ".pdf":
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    elif ext == ".docx":
        doc = docx.Document(file_path)
        text = []
        for para in doc.paragraphs:
            text.append(para.text)
        return "\n".join(text)
    elif ext in [".txt", ".md"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file format: {file_extension}")
