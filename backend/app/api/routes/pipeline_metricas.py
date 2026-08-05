from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from sqlalchemy import func, case

from app.database.database import SessionLocal

from app.models.lead import Lead





router = APIRouter(

    prefix="/pipeline",

    tags=["Pipeline Métricas"]

)






def get_db():


    db = SessionLocal()


    try:

        yield db


    finally:

        db.close()







@router.get("/metricas")

def buscar_metricas_pipeline(

    db: Session = Depends(get_db)

):


    resultados = db.query(

        Lead.status,

        func.count(

            Lead.id

        ).label(

            "quantidade"

        ),


        func.avg(

            Lead.score

        ).label(

            "score_medio"

        ),


        func.sum(

            case(

                (

                    Lead.prioridade == "ALTA",

                    1

                ),

                else_=0

            )

        ).label(

            "alta_prioridade"

        )



    ).group_by(

        Lead.status

    ).all()







    metricas = {}






    for item in resultados:


        metricas[item.status] = {


            "quantidade":

                item.quantidade,



            "score_medio":

                round(

                    float(item.score_medio or 0),

                    2

                ),



            "alta_prioridade":

                int(item.alta_prioridade or 0)

        }





    return metricas