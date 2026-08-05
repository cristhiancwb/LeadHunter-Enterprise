from sqlalchemy.orm import Session

from app.models.lead import Lead



def buscar_todos(db: Session):

    return db.query(
        Lead
    ).all()



def buscar_por_id(
    db: Session,
    lead_id:int
):

    return db.query(
        Lead
    ).filter(
        Lead.id == lead_id
    ).first()