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


class CampaignMessage(Base):

    __tablename__ = "campaign_messages"

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

    lead_id = Column(
        Integer,
        ForeignKey("leads.id"),
        nullable=False,
        index=True
    )

    template_id = Column(
        Integer,
        ForeignKey("message_templates.id"),
        nullable=True
    )

    origem = Column(
        String(20),
        default="TEMPLATE",
        nullable=False
    )

    canal = Column(
        String(50),
        nullable=False
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
        default="CREATED",
        nullable=False
    )

    agendado_em = Column(
        DateTime,
        nullable=True
    )

    enviado_em = Column(
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

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    campaign = relationship(
        "Campaign",
        back_populates="messages"
    )

    lead = relationship(
        "Lead"
    )

    template = relationship(
        "MessageTemplate"
    )

