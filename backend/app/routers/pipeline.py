from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead_status import LeadStatus



router = APIRouter(
    prefix="",
    tags=["Pipeline"]
)



@router.get("/")
def listar_pipeline(
    db: Session = Depends(get_db)
):


    leads = db.query(
        LeadStatus
    ).all()


    return leads





@router.put("/status/{lead_id}")
def atualizar_status_pipeline(
    lead_id: int,
    dados: dict,
    db: Session = Depends(get_db)
):
    lead = db.query(
        LeadStatus
    ).filter(
        LeadStatus.id == lead_id
    ).first()

    if not lead:
        return {
            "erro": "Lead nao encontrado",
            "lead_id": lead_id
        }

    lead.status = dados.get("status", "NOVO")

    db.commit()
    db.refresh(lead)

    return lead
