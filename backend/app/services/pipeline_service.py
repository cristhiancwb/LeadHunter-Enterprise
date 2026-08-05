from datetime import datetime

from app.database.database import SessionLocal
from app.models.lead import Lead
from app.models.lead_historico import LeadHistorico



# =====================================
# ATUALIZAR STATUS DO PIPELINE
# =====================================

def atualizar_status_pipeline(
    lead_id: int,
    novo_status: str,
    usuario: str = "Sistema"
):

    db = SessionLocal()


    try:

        lead = (

            db.query(Lead)

            .filter(
                Lead.id == lead_id
            )

            .first()

        )


        if not lead:

            return {

                "erro": "Lead não encontrado"

            }



        status_anterior = lead.status



        # Atualiza lead

        lead.status = novo_status



        # Cria histórico comercial

        historico = LeadHistorico(

            lead_id=lead.id,

            status_anterior=status_anterior,

            status_novo=novo_status,

            observacao=f"Alteração realizada por {usuario}"

        )


        db.add(historico)



        db.commit()



        db.refresh(lead)



        return {

            "mensagem": "Status atualizado com sucesso",

            "lead": {

                "id": lead.id,

                "empresa": lead.empresa,

                "status_anterior": status_anterior,

                "status_novo": lead.status

            }


        }



    except Exception as e:


        db.rollback()


        raise e



    finally:


        db.close()





# =====================================
# LISTAR PIPELINE
# =====================================

def listar_pipeline():


    db = SessionLocal()


    try:


        leads = (

            db.query(Lead)

            .order_by(
                Lead.id.desc()
            )

            .all()

        )



        return [


            {

                "id": lead.id,

                "empresa": lead.empresa,

                "nome": lead.nome,

                "cidade": lead.cidade,

                "segmento": lead.segmento,

                "telefone": lead.telefone,

                "email": lead.email,

                "score": lead.score,

                "prioridade": lead.prioridade,

                "status": lead.status,

                "observacao": lead.observacao


            }

            for lead in leads


        ]


    finally:

        db.close()