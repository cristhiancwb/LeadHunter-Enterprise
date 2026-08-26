from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database.database import SessionLocal
from app.models.lead import Lead


router = APIRouter(
    tags=["CRM"]

)



class LeadUpdate(BaseModel):
    nome: str | None = None
    empresa: str | None = None
    telefone: str | None = None
    email: str | None = None
    cidade: str | None = None
    segmento: str | None = None
    origem: str | None = None
    observacao: str | None = None
    status: str | None = None

@router.get("/leads/{lead_id}")
def buscar_lead(lead_id: int):

    db = SessionLocal()

    try:

        lead = (
            db.query(Lead)
            .filter(Lead.id == lead_id)
            .first()
        )

        if not lead:
            raise HTTPException(
                status_code=404,
                detail="Lead não encontrado"
            )

        return {
            "id": lead.id,
            "nome": lead.nome,
            "empresa": lead.empresa,
            "telefone": lead.telefone,
            "email": lead.email,
            "cidade": lead.cidade,
            "segmento": lead.segmento,
            "status": lead.status,
            "observacao": lead.observacao,
            "score": lead.score,
            "prioridade": lead.prioridade
        }

    finally:

        db.close()





@router.put("/leads/{lead_id}")
def atualizar_lead(

    lead_id:int,

    dados:LeadUpdate

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

            raise HTTPException(

                status_code=404,

                detail="Lead não encontrado"

            )



        if dados.nome is not None:
            lead.nome = dados.nome

        if dados.empresa is not None:
            lead.empresa = dados.empresa

        if dados.telefone is not None:
            lead.telefone = dados.telefone

        if dados.email is not None:
            lead.email = dados.email

        if dados.cidade is not None:
            lead.cidade = dados.cidade

        if dados.segmento is not None:
            lead.segmento = dados.segmento

        if dados.origem is not None:
            lead.origem = dados.origem

        if dados.observacao is not None:
            lead.observacao = dados.observacao

        if dados.status is not None:
            lead.status = dados.status



        db.commit()

        db.refresh(lead)



        return {


            "mensagem":
            "Lead atualizado com sucesso",


            "lead": {


                "id": lead.id,

                "empresa": lead.empresa,

                "status": lead.status,

                "observacao": lead.observacao


            }


        }



    finally:


        db.close()

