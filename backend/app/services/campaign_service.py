from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.schemas.campaign import (
    CampaignCreate,
    CampaignUpdate,
    CampaignStatusUpdate,
)


class CampaignService:

    @staticmethod
    def criar(
        db: Session,
        dados: CampaignCreate
    ):

        campanha = Campaign(
            nome=dados.nome,
            descricao=dados.descricao,
            objetivo=dados.objetivo,
            status=dados.status,
            canal=dados.canal,
            ativa=dados.ativa,
            data_inicio=dados.data_inicio,
            data_fim=dados.data_fim,
        )

        db.add(campanha)
        db.commit()
        db.refresh(campanha)

        return campanha

    @staticmethod
    def listar(
        db: Session
    ):

        return (
            db.query(Campaign)
            .order_by(Campaign.created_at.desc())
            .all()
        )

    @staticmethod
    def buscar(
        db: Session,
        campaign_id: int
    ):

        return (
            db.query(Campaign)
            .filter(
                Campaign.id == campaign_id
            )
            .first()
        )

    @staticmethod
    def atualizar(
        db: Session,
        campaign_id: int,
        dados: CampaignUpdate
    ):

        campanha = CampaignService.buscar(
            db,
            campaign_id
        )

        if not campanha:
            return None

        valores = dados.model_dump(
            exclude_unset=True
        )

        for campo, valor in valores.items():

            setattr(
                campanha,
                campo,
                valor
            )

        db.commit()
        db.refresh(campanha)

        return campanha

    @staticmethod
    def atualizar_status(
        db: Session,
        campaign_id: int,
        dados: CampaignStatusUpdate
    ):

        campanha = CampaignService.buscar(
            db,
            campaign_id
        )

        if not campanha:
            return None

        campanha.status = dados.status

        if dados.ativa is not None:
            campanha.ativa = dados.ativa

        db.commit()
        db.refresh(campanha)

        return campanha

    @staticmethod
    def excluir(
        db: Session,
        campaign_id: int
    ):

        campanha = CampaignService.buscar(
            db,
            campaign_id
        )

        if not campanha:
            return False

        db.delete(campanha)
        db.commit()

        return True
