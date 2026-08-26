from fastapi import APIRouter, Depends, Query

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead import Lead
from app.services.pipeline_service import atualizar_status_pipeline



router = APIRouter()





# =====================================
# PIPELINE LEADS
# =====================================

@router.get("/leads")
def listar_pipeline(
    segmento: str | None = Query(
        default=None
    ),
    db: Session = Depends(get_db)
):


    query = db.query(Lead)

    if segmento and segmento.strip():

        query = query.filter(
            Lead.segmento.ilike(
                f"%{segmento.strip()}%"
            )
        )

    leads = query.all()



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
# ATUALIZAR STATUS DE UM LEAD
# =====================================

@router.put("/leads/{lead_id}/status")
def atualizar_status_lead(
    lead_id: int,
    dados: dict
):

    novo_status = dados.get(
        "status",
        "NOVO"
    )

    return atualizar_status_pipeline(
        lead_id=lead_id,
        novo_status=novo_status
    )


