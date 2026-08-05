from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.followup import Followup

router = APIRouter(
    prefix="/followups",
    tags=["FollowUps"]
)


@router.get(
    "/{lead_id}",
    operation_id="listar_followups"
)
def listar_followups(
    lead_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(Followup)
        .filter(Followup.lead_id == lead_id)
        .order_by(Followup.data_agendada.asc())
        .all()
    )


@router.post(
    "",
    operation_id="criar_followup"
)
def criar_followup(
    dados: dict,
    db: Session = Depends(get_db)
):

    novo = Followup(

        lead_id=dados["lead_id"],

        titulo=dados["titulo"],

        descricao=dados.get("descricao"),

        observacao=dados.get("observacao"),

        data_agendada=datetime.fromisoformat(
            dados["data_agendada"]
        ) if dados.get("data_agendada") else None

    )

    db.add(novo)

    db.commit()

    db.refresh(novo)

    return novo


@router.put(
    "/{id}",
    operation_id="editar_followup"
)
def editar_followup(
    id: int,
    dados: dict,
    db: Session = Depends(get_db)
):

    followup = db.query(Followup).get(id)

    if not followup:
        raise HTTPException(404, "Follow-up não encontrado")

    for campo, valor in dados.items():

        if campo == "data_agendada" and valor:

            valor = datetime.fromisoformat(valor)

        setattr(followup, campo, valor)

    db.commit()

    db.refresh(followup)

    return followup


@router.put(
    "/{id}/concluir",
    operation_id="concluir_followup"
)
def concluir_followup(
    id: int,
    db: Session = Depends(get_db)
):

    followup = db.query(Followup).get(id)

    if not followup:
        raise HTTPException(404, "Follow-up não encontrado")

    followup.concluido = True
    followup.data_conclusao = datetime.utcnow()

    db.commit()

    return {
        "mensagem": "Follow-up concluído"
    }


@router.delete(
    "/{id}",
    operation_id="excluir_followup"
)
def excluir_followup(
    id: int,
    db: Session = Depends(get_db)
):

    followup = db.query(Followup).get(id)

    if not followup:
        raise HTTPException(404, "Follow-up não encontrado")

    db.delete(followup)

    db.commit()

    return {
        "mensagem": "Follow-up removido"
    }