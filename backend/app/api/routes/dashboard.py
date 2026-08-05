from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead import Lead


router = APIRouter()



# =====================================
# DASHBOARD - ESTATISTICAS
# =====================================

@router.get("/estatisticas")
def buscar_estatisticas(
    db: Session = Depends(get_db)
):

    try:

        leads = (
            db.query(Lead)
            .all()
        )


        total_leads = len(leads)


        pipeline = {}

        prioridades = {}


        total_score = 0

        quantidade_score = 0



        for lead in leads:


            # STATUS PIPELINE

            status = (
                getattr(
                    lead,
                    "status",
                    None
                )
                or "NOVO"
            )


            pipeline[status] = (
                pipeline.get(status, 0)
                + 1
            )



            # PRIORIDADE

            prioridade = (
                getattr(
                    lead,
                    "prioridade",
                    None
                )
                or "MEDIA"
            )


            prioridades[prioridade] = (
                prioridades.get(
                    prioridade,
                    0
                )
                + 1
            )



            # SCORE

            score = getattr(
                lead,
                "score",
                None
            )


            if score:

                total_score += score

                quantidade_score += 1



        media_score = 0


        if quantidade_score > 0:

            media_score = round(
                total_score / quantidade_score,
                2
            )



        melhor_lead = None



        lead_top = (

            db.query(Lead)

            .order_by(
                getattr(
                    Lead,
                    "score"
                ).desc()
            )

            .first()

        )



        if lead_top:

            melhor_lead = {

                "id": lead_top.id,

                "empresa": (
                    getattr(
                        lead_top,
                        "empresa",
                        None
                    )
                ),

                "score": (
                    getattr(
                        lead_top,
                        "score",
                        0
                    )
                )

            }



        return {


            "periodo": "todos",


            "total_leads": total_leads,


            "pipeline": pipeline,


            "prioridades": prioridades,


            "media_score": media_score,


            "melhor_lead": melhor_lead


        }



    except Exception as e:


        return {

            "periodo": "todos",

            "total_leads": 0,

            "pipeline": {},

            "prioridades": {},

            "media_score": 0,

            "melhor_lead": None,

            "erro": str(e)

        }



# =====================================
# RESUMO
# =====================================

@router.get("/")
def dashboard_resumo(
    db: Session = Depends(get_db)
):

    total = (
        db.query(Lead)
        .count()
    )


    return {

        "dashboard": "online",

        "total_leads": total

    }