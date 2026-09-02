from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from ..database.database import Base


class CampaignProduct(Base):

    __tablename__ = "campaign_products"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    campaign_id = Column(
        Integer,
        ForeignKey(
            "campaigns.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    product_id = Column(
        Integer,
        ForeignKey(
            "products.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Preço utilizado especificamente nesta campanha.
    # Se não for informado, o sistema poderá utilizar
    # o preço atual do produto.
    preco_oferta = Column(
        Float,
        nullable=True,
    )

    quantidade_oferta = Column(
        Integer,
        nullable=True,
    )

    ativo = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    campaign = relationship(
        "Campaign",
        back_populates="products",
    )

    product = relationship(
        "Product",
        back_populates="campaigns",
    )
