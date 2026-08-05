from app.database.database import conectar
from app.models.lead import Lead


def listar_ranking():

    db = conectar()

    try:

        leads = db.query(
            Lead
        ).order_by(
            Lead.score.desc()
        ).limit(10).all()


        ranking = []


        for lead in leads:

            ranking.append({

                "empresa": lead.empresa,

                "score": lead.score,

                "prioridade": lead.prioridade,

                "telefone": lead.telefone

            })


        return ranking


    finally:
        db.close()