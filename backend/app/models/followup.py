from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class Followup(Base):

    __tablename__ = "followups"

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

    tipo = Column(
        String(50),
        nullable=False
    )

    titulo = Column(
        String(150),
        nullable=False
    )

    descricao = Column(
        Text,
        nullable=True
    )

    responsavel = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(30),
        nullable=False
    )

    concluido = Column(
        Boolean,
        nullable=False,
        default=False
    )

    data_agendada = Column(
        DateTime,
        nullable=True
    )

    data_conclusao = Column(
        DateTime,
        nullable=True
    )

    criado_em = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    atualizado_em = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    usuario = Column(
        String,
        nullable=True
    )

    observacao = Column(
        Text,
        nullable=True
    )

    lead = relationship(
        "Lead",
        back_populates="followups"
    )
