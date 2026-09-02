from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead import Lead



router = APIRouter(

    prefix="/leads",

    tags=["Leads"]

)





@router.get("")

def listar_leads(

    db: Session = Depends(get_db)

):


    leads = db.query(Lead).all()



    return [


        {


            "id": lead.id,

            "nome": lead.nome,

            "empresa": lead.empresa,

            "telefone": lead.telefone,

            "email": lead.email,

            "cidade": lead.cidade,

            "segmento": lead.segmento,

            "status": lead.status,

            "score": lead.score or 0,

            "prioridade": lead.prioridade or "BAIXA",

            "valor_estimado": getattr(lead, "valor_estimado", 0) or 0


        }


        for lead in leads


    ]
@router.get("/{lead_id}")
def buscar_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if not lead:
        return {
            "erro": "Lead nao encontrado",
            "lead_id": lead_id
        }

    return lead


