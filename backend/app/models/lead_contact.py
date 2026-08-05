from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class LeadContact(Base):

    __tablename__ = "lead_contacts"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    lead_id = Column(
        Integer,
        ForeignKey("leads.id"),
        nullable=False
    )


    nome = Column(
        String(255),
        nullable=True
    )


    cargo = Column(
        String(150),
        nullable=True
    )


    telefone = Column(
        String(50),
        nullable=True
    )


    whatsapp = Column(
        String(50),
        nullable=True
    )


    email = Column(
        String(255),
        nullable=True
    )


    linkedin = Column(
        String(255),
        nullable=True
    )


    principal = Column(
        Boolean,
        default=False
    )


    observacao = Column(
        String,
        nullable=True
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    # ==========================
    # RELACIONAMENTO
    # ==========================

    lead = relationship(
        "Lead",
        back_populates="contacts"
    )