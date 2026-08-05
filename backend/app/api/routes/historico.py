from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import conectar
from app.models.lead import Lead
from app.models.lead_historico import LeadHistorico


router = APIRouter(
    prefix="/historico",
    tags=["Histórico"]
)


@router.get("/{lead_id}")
def listar_historico(
    lead_id: int,
    db: Session = Depends(conectar)
):
    """
    Retorna todo o histórico de um lead.
    """

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

    historico = (
        db.query(LeadHistorico)
        .filter(LeadHistorico.lead_id == lead_id)
        .order_by(
            LeadHistorico.data_alteracao.desc()
        )
        .all()
    )

    return [
        {
            "id": item.id,
            "lead_id": item.lead_id,
            "status_anterior": item.status_anterior,
            "status_novo": item.status_novo,
            "observacao": item.observacao,
            "data_alteracao": item.data_alteracao
        }
        for item in historico
    ]


@router.post("/")
def criar_historico(
    dados: dict,
    db: Session = Depends(conectar)
):
    """
    Cria um registro de histórico.
    """

    lead = (
        db.query(Lead)
        .filter(Lead.id == dados["lead_id"])
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead não encontrado"
        )

    novo = LeadHistorico(
        lead_id=dados["lead_id"],
        status_anterior=dados.get("status_anterior"),
        status_novo=dados.get("status_novo"),
        observacao=dados.get("observacao"),
        data_alteracao=datetime.utcnow()
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    return {
        "mensagem": "Histórico criado com sucesso",
        "id": novo.id
    }


@router.delete("/{historico_id}")
def excluir_historico(
    historico_id: int,
    db: Session = Depends(conectar)
):

    registro = (
        db.query(LeadHistorico)
        .filter(
            LeadHistorico.id == historico_id
        )
        .first()
    )

    if not registro:
        raise HTTPException(
            status_code=404,
            detail="Registro não encontrado"
        )

    db.delete(registro)
    db.commit()

    return {
        "mensagem": "Registro removido"
    }