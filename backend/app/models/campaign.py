from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean
)

from sqlalchemy.orm import relationship

from ..database.database import Base


class Campaign(Base):

    __tablename__ = "campaigns"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nome = Column(
        String(255),
        nullable=False
    )

    descricao = Column(
        Text,
        nullable=True
    )

    objetivo = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(50),
        default="DRAFT",
        nullable=False
    )

    canal = Column(
        String(100),
        nullable=True
    )

    ativa = Column(
        Boolean,
        default=False
    )

    data_inicio = Column(
        DateTime,
        nullable=True
    )

    data_fim = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    assets = relationship(
        "CampaignAsset",
        back_populates="campaign",
        cascade="all, delete-orphan"
    )

    messages = relationship(
        "CampaignMessage",
        back_populates="campaign",
        cascade="all, delete-orphan"
    )

    products = relationship(
        "CampaignProduct",
        back_populates="campaign",
        cascade="all, delete-orphan"
    )

