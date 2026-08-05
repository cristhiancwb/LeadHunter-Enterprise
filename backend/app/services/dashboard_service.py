from sqlalchemy import func

from app.database.database import conectar
from app.models.lead import Lead



def obter_resumo_dashboard():

    db = conectar()

    try:

        total_leads = db.query(
            func.count(Lead.id)
        ).scalar()


        alta_prioridade = db.query(
            func.count(Lead.id)
        ).filter(
            Lead.prioridade == "ALTA"
        ).scalar()


        media_prioridade = db.query(
            func.count(Lead.id)
        ).filter(
            Lead.prioridade == "MEDIA"
        ).scalar()


        media_score = db.query(
            func.avg(Lead.score)
        ).scalar()


        melhor_lead = db.query(
            Lead
        ).order_by(
            Lead.score.desc()
        ).first()



        return {

            "total_leads": total_leads or 0,

            "alta_prioridade": alta_prioridade or 0,

            "media_prioridade": media_prioridade or 0,

            "media_avaliacao": round(media_score, 2)
            if media_score else 0,


            "melhor_lead": {

                "empresa": melhor_lead.empresa,

                "score": melhor_lead.score,

                "prioridade": melhor_lead.prioridade,

                "telefone": melhor_lead.telefone

            }
            if melhor_lead else None

        }


    finally:

        db.close()





def obter_analytics_dashboard():

    db = conectar()

    try:

        alta = db.query(
            func.count(Lead.id)
        ).filter(
            Lead.prioridade == "ALTA"
        ).scalar()


        media = db.query(
            func.count(Lead.id)
        ).filter(
            Lead.prioridade == "MEDIA"
        ).scalar()


        baixa = db.query(
            func.count(Lead.id)
        ).filter(
            Lead.prioridade == "BAIXA"
        ).scalar()


        score_medio = db.query(
            func.avg(Lead.score)
        ).scalar()



        return {

            "prioridade": {

                "alta": alta or 0,

                "media": media or 0,

                "baixa": baixa or 0

            },


            "score_medio": round(score_medio, 2)
            if score_medio else 0

        }


    finally:

        db.close()





def obter_score_ranking():

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

                "prioridade": lead.prioridade

            })


        return ranking



    finally:

        db.close()