from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.campaign_product import CampaignProduct
from app.models.product import Product


class CampaignProductService:

    @staticmethod
    def adicionar(
        db: Session,
        campaign_id: int,
        product_id: int,
        preco_oferta: float | None = None,
        quantidade_oferta: int | None = None,
    ):

        campanha = (
            db.query(Campaign)
            .filter(Campaign.id == campaign_id)
            .first()
        )

        if not campanha:
            return None, "Campanha não encontrada"

        produto = (
            db.query(Product)
            .filter(Product.id == product_id)
            .first()
        )

        if not produto:
            return None, "Produto não encontrado"

        existente = (
            db.query(CampaignProduct)
            .filter(
                CampaignProduct.campaign_id == campaign_id,
                CampaignProduct.product_id == product_id,
            )
            .first()
        )

        if existente:
            return None, "Produto já está vinculado à campanha"

        item = CampaignProduct(
            campaign_id=campaign_id,
            product_id=product_id,
            preco_oferta=preco_oferta,
            quantidade_oferta=quantidade_oferta,
            ativo=True,
        )

        db.add(item)
        db.commit()
        db.refresh(item)

        return item, None


    @staticmethod
    def listar(
        db: Session,
        campaign_id: int,
    ):

        return (
            db.query(CampaignProduct)
            .filter(
                CampaignProduct.campaign_id == campaign_id
            )
            .order_by(
                CampaignProduct.created_at.asc()
            )
            .all()
        )


    @staticmethod
    def buscar(
        db: Session,
        campaign_product_id: int,
    ):

        return (
            db.query(CampaignProduct)
            .filter(
                CampaignProduct.id == campaign_product_id
            )
            .first()
        )


    @staticmethod
    def atualizar(
        db: Session,
        campaign_product_id: int,
        preco_oferta: float | None = None,
        quantidade_oferta: int | None = None,
        ativo: bool | None = None,
    ):

        item = CampaignProductService.buscar(
            db,
            campaign_product_id
        )

        if not item:
            return None, "Produto da campanha não encontrado"

        if preco_oferta is not None:
            item.preco_oferta = preco_oferta

        if quantidade_oferta is not None:
            item.quantidade_oferta = quantidade_oferta

        if ativo is not None:
            item.ativo = ativo

        db.commit()
        db.refresh(item)

        return item, None


    @staticmethod
    def remover(
        db: Session,
        campaign_product_id: int,
    ):

        item = CampaignProductService.buscar(
            db,
            campaign_product_id
        )

        if not item:
            return False

        db.delete(item)
        db.commit()

        return True
