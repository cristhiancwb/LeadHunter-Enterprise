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


class LeadActivity(Base):

    __tablename__ = "lead_activities"

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

    tipo = Column(
        String(50),
        nullable=False,
        default="NOTE"
    )

    titulo = Column(
        String(255),
        nullable=False
    )

    descricao = Column(
        Text,
        nullable=True
    )

    usuario = Column(
        String(255),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    lead = relationship(
        "Lead",
        back_populates="activities"
    )
