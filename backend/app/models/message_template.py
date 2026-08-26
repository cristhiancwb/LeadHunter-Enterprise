from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime
)

from ..database.database import Base


class MessageTemplate(Base):

    __tablename__ = "message_templates"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nome = Column(
        String(255),
        nullable=False
    )

    categoria = Column(
        String(100),
        nullable=True
    )

    canal = Column(
        String(50),
        nullable=False
    )

    titulo = Column(
        String(255),
        nullable=True
    )

    conteudo = Column(
        Text,
        nullable=False
    )

    variaveis = Column(
        Text,
        nullable=True
    )

    ativo = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
