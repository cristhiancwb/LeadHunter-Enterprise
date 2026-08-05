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

            "valor_estimado": lead.valor_estimado or 0


        }


        for lead in leads


    ]