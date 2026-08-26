from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text
)

from ..database.database import Base

from sqlalchemy.orm import relationship


class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nome = Column(
        String(255),
        nullable=False,
        index=True
    )

    sku = Column(
        String(100),
        unique=True,
        nullable=True,
        index=True
    )

    categoria = Column(
        String(100),
        nullable=True,
        index=True
    )

    descricao = Column(
        Text,
        nullable=True
    )

    preco = Column(
        Float,
        default=0
    )

    custo = Column(
        Float,
        default=0
    )

    estoque = Column(
        Integer,
        default=0
    )

    ativo = Column(
        Boolean,
        default=True
    )

    imagem_principal = Column(
        String(500),
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

    campaigns = relationship(
        "CampaignProduct",
        back_populates="product",
        cascade="all, delete-orphan"
    )

