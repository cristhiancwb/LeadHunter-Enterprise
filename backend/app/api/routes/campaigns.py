from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.campaign import (
    CampaignCreate,
    CampaignUpdate,
    CampaignStatusUpdate,
    CampaignResponse,
)

from app.services.campaign_service import CampaignService


router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"],
)


@router.post(
    "",
    response_model=CampaignResponse,
    status_code=201,
)
def criar_campanha(
    dados: CampaignCreate,
    db: Session = Depends(get_db),
):

    return CampaignService.criar(
        db,
        dados
    )


@router.get(
    "",
    response_model=list[CampaignResponse],
)
def listar_campanhas(
    db: Session = Depends(get_db),
):

    return CampaignService.listar(
        db
    )


@router.get(
    "/{campaign_id}",
    response_model=CampaignResponse,
)
def buscar_campanha(
    campaign_id: int,
    db: Session = Depends(get_db),
):

    campanha = CampaignService.buscar(
        db,
        campaign_id
    )

    if not campanha:

        raise HTTPException(
            status_code=404,
            detail="Campanha não encontrada",
        )

    return campanha


@router.put(
    "/{campaign_id}",
    response_model=CampaignResponse,
)
def atualizar_campanha(
    campaign_id: int,
    dados: CampaignUpdate,
    db: Session = Depends(get_db),
):

    campanha = CampaignService.atualizar(
        db,
        campaign_id,
        dados
    )

    if not campanha:

        raise HTTPException(
            status_code=404,
            detail="Campanha não encontrada",
        )

    return campanha


@router.patch(
    "/{campaign_id}/status",
    response_model=CampaignResponse,
)
def atualizar_status_campanha(
    campaign_id: int,
    dados: CampaignStatusUpdate,
    db: Session = Depends(get_db),
):

    campanha = CampaignService.atualizar_status(
        db,
        campaign_id,
        dados
    )

    if not campanha:

        raise HTTPException(
            status_code=404,
            detail="Campanha não encontrada",
        )

    return campanha


@router.delete(
    "/{campaign_id}",
)
def excluir_campanha(
    campaign_id: int,
    db: Session = Depends(get_db),
):

    removida = CampaignService.excluir(
        db,
        campaign_id
    )

    if not removida:

        raise HTTPException(
            status_code=404,
            detail="Campanha não encontrada",
        )

    return {
        "mensagem": "Campanha removida com sucesso"
    }
