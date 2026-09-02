from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead import Lead



router = APIRouter()





# =====================================
# PIPELINE LEADS
# =====================================

@router.get("/leads")
def listar_pipeline(

    db: Session = Depends(get_db)

):


    leads = (

        db.query(Lead)

        .all()

    )



    resultado = {

        "NOVO": [],

        "CONTATO": [],

        "QUALIFICADO": [],

        "FECHADO": [],

        "PERDIDO": []

    }




    for lead in leads:


        status = (

            getattr(

                lead,

                "status",

                "NOVO"

            )

            or "NOVO"

        )



        if status not in resultado:

            resultado[status] = []



        resultado[status].append(lead)



    return resultado
# =====================================
# ATUALIZAR STATUS DO PIPELINE
# =====================================

@router.put("/status/{lead_id}")
def atualizar_status_pipeline(
    lead_id: int,
    dados: dict,
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

    lead.status = (
        dados.get("status")
        or "NOVO"
    )

    db.commit()
    db.refresh(lead)

    return lead
