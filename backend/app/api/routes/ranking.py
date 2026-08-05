from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.lead import Lead



router = APIRouter()





# =====================================
# DASHBOARD RANKING DE LEADS
# =====================================

@router.get("/ranking")
def ranking_leads(

    db: Session = Depends(get_db)

):


    try:


        leads = (

            db.query(Lead)

            .order_by(

                Lead.score.desc()

            )

            .all()

        )



        resultado = []



        for posicao, lead in enumerate(
            leads,
            start=1
        ):


            resultado.append({


                "posicao": posicao,


                "id": lead.id,


                "empresa":
                    getattr(
                        lead,
                        "empresa",
                        None
                    ),


                "cidade":
                    getattr(
                        lead,
                        "cidade",
                        None
                    ),


                "segmento":
                    getattr(
                        lead,
                        "segmento",
                        None
                    ),


                "telefone":
                    getattr(
                        lead,
                        "telefone",
                        None
                    ),


                "email":
                    getattr(
                        lead,
                        "email",
                        ""
                    ),


                "score":
                    getattr(
                        lead,
                        "score",
                        0
                    ),


                "prioridade":
                    getattr(
                        lead,
                        "prioridade",
                        "MEDIA"
                    ),


                "status":
                    getattr(
                        lead,
                        "status",
                        "NOVO"
                    )

            })



        return resultado



    except Exception as e:


        return {

            "erro": str(e)

        }