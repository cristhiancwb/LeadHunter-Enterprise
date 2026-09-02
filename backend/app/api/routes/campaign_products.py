from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.campaign_product import (
    CampaignProductCreate,
    CampaignProductUpdate,
    CampaignProductResponse,
)

from app.services.campaign_product_service import (
    CampaignProductService,
)


router = APIRouter(
    prefix="/campaigns",
    tags=["Campaign Products"],
)


@router.post(
    "/{campaign_id}/products",
    response_model=CampaignProductResponse,
    status_code=201,
)
def adicionar_produto_campanha(
    campaign_id: int,
    dados: CampaignProductCreate,
    db: Session = Depends(get_db),
):

    item, erro = CampaignProductService.adicionar(
        db=db,
        campaign_id=campaign_id,
        product_id=dados.product_id,
        preco_oferta=dados.preco_oferta,
        quantidade_oferta=dados.quantidade_oferta,
    )

    if erro:

        if erro in [
            "Campanha não encontrada",
            "Produto não encontrado",
        ]:
            status_code = 404

        elif erro == "Produto já está vinculado à campanha":
            status_code = 409

        else:
            status_code = 400

        raise HTTPException(
            status_code=status_code,
            detail=erro,
        )

    return item


@router.get(
    "/{campaign_id}/products",
    response_model=list[CampaignProductResponse],
)
def listar_produtos_campanha(
    campaign_id: int,
    db: Session = Depends(get_db),
):

    return CampaignProductService.listar(
        db,
        campaign_id,
    )


@router.put(
    "/products/{campaign_product_id}",
    response_model=CampaignProductResponse,
)
def atualizar_produto_campanha(
    campaign_product_id: int,
    dados: CampaignProductUpdate,
    db: Session = Depends(get_db),
):

    item, erro = CampaignProductService.atualizar(
        db=db,
        campaign_product_id=campaign_product_id,
        preco_oferta=dados.preco_oferta,
        quantidade_oferta=dados.quantidade_oferta,
        ativo=dados.ativo,
    )

    if erro:

        raise HTTPException(
            status_code=404,
            detail=erro,
        )

    return item


@router.delete(
    "/products/{campaign_product_id}",
)
def remover_produto_campanha(
    campaign_product_id: int,
    db: Session = Depends(get_db),
):

    removido = CampaignProductService.remover(
        db,
        campaign_product_id,
    )

    if not removido:

        raise HTTPException(
            status_code=404,
            detail="Produto da campanha não encontrado",
        )

    return {
        "mensagem": "Produto removido da campanha com sucesso"
    }
