from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.campaign_message import (
    CampaignMessageGenerate,
    CampaignMessageStatusUpdate,
    CampaignMessageResponse,
)

from app.services.campaign_message_service import (
    CampaignMessageService,
)


router = APIRouter(
    prefix="/campaigns",
    tags=["Campaign Messages"],
)


@router.post(
    "/{campaign_id}/messages/generate",
    response_model=list[CampaignMessageResponse],
)
def gerar_mensagens(
    campaign_id: int,
    dados: CampaignMessageGenerate,
    db: Session = Depends(get_db),
):

    mensagens, erro = CampaignMessageService.gerar(
        db,
        campaign_id,
        dados,
    )

    if erro:
        raise HTTPException(
            status_code=404,
            detail=erro,
        )

    return mensagens


@router.get(
    "/{campaign_id}/messages",
    response_model=list[CampaignMessageResponse],
)
def listar_mensagens(
    campaign_id: int,
    db: Session = Depends(get_db),
):

    return CampaignMessageService.listar(
        db,
        campaign_id,
    )


@router.patch(
    "/messages/{message_id}/status",
    response_model=CampaignMessageResponse,
)
def atualizar_status(
    message_id: int,
    dados: CampaignMessageStatusUpdate,
    db: Session = Depends(get_db),
):

    mensagem = CampaignMessageService.atualizar_status(
        db,
        message_id,
        dados.status,
        dados.erro,
    )

    if not mensagem:

        raise HTTPException(
            status_code=404,
            detail="Mensagem da campanha não encontrada",
        )

    return mensagem
