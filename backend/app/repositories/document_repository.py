from app.models.document import Document


def create_document(
    db,
    filename: str,
    sop_id: int
):

    document = Document(
        filename=filename,
        sop_id=sop_id
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    return document


def get_document_by_id(
    db,
    document_id: int
):

    return (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )


def get_all_documents(
    db
):

    return (
        db.query(Document)
        .all()
    )


def delete_document(
    db,
    document: Document
):

    db.delete(document)

    db.commit()