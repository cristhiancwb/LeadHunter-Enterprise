from sqlalchemy.orm import Session

from app.models.lead import Lead


def existe_lead(
    db: Session,
    email: str
):

    return db.query(
        Lead
    ).filter(
        Lead.email == email
    ).first()