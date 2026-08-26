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


class LeadMessage(Base):

    __tablename__ = "lead_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    lead_id = Column(
        Integer,
        ForeignKey("leads.id"),
        nullable=False,
        index=True
    )

    campaign_id = Column(
        Integer,
        ForeignKey("campaigns.id"),
        nullable=True,
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=True,
        index=True
    )

    template_id = Column(
        Integer,
        ForeignKey("message_templates.id"),
        nullable=True,
        index=True
    )

    canal = Column(
        String(50),
        nullable=False,
        default="email"
    )

    assunto = Column(
        String(255),
        nullable=True
    )

    mensagem = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False,
        default="CREATED"
    )

    imagem_url = Column(
        String(500),
        nullable=True
    )

    arquivo_url = Column(
        String(500),
        nullable=True
    )

    enviado_em = Column(
        DateTime,
        nullable=True
    )

    lido_em = Column(
        DateTime,
        nullable=True
    )

    respondido_em = Column(
        DateTime,
        nullable=True
    )

    erro = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    lead = relationship(
        "Lead",
        back_populates="messages"
    )

    campaign = relationship(
        "Campaign",
        foreign_keys=[campaign_id]
    )

    template = relationship(
        "MessageTemplate",
        foreign_keys=[template_id]
    )
