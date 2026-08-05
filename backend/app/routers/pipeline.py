from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead_status import LeadStatus



router = APIRouter(
    prefix="/api/leads",
    tags=["Pipeline"]
)



@router.get("/pipeline")
def listar_pipeline(
    db: Session = Depends(get_db)
):


    leads = db.query(
        LeadStatus
    ).all()


    return leads




@router.put("/{empresa}/status")
def atualizar_status(
    empresa: str,
    dados: dict,
    db: Session = Depends(get_db)
):


    lead = db.query(
        LeadStatus
    ).filter(
        LeadStatus.empresa == empresa
    ).first()



    if not lead:

        lead = LeadStatus(
            empresa=empresa
        )

        db.add(lead)



    lead.status = dados.get(
        "status",
        "NOVO"
    )


    db.commit()

    db.refresh(
        lead
    )


    return lead