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