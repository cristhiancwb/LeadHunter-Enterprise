from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from ..database.database import Base


class CampaignAsset(Base):

    __tablename__ = "campaign_assets"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    campaign_id = Column(
        Integer,
        ForeignKey("campaigns.id"),
        nullable=False,
        index=True
    )

    nome_arquivo = Column(
        String(255),
        nullable=False
    )

    tipo = Column(
        String(50),
        nullable=True
    )

    url = Column(
        String(500),
        nullable=True
    )

    descricao = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    campaign = relationship(
        "Campaign",
        back_populates="assets"
    )
