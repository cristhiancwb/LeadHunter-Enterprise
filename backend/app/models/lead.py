from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime
)

from sqlalchemy.orm import relationship

from app.database.database import Base



class Lead(Base):


    __tablename__ = "leads"



    id = Column(

        Integer,

        primary_key=True,

        index=True

    )



    nome = Column(

        String,

        nullable=True

    )



    empresa = Column(

        String,

        nullable=True

    )



    telefone = Column(

        String,

        nullable=True

    )



    email = Column(

        String,

        nullable=True

    )



    cidade = Column(

        String,

        nullable=True

    )



    segmento = Column(

        String,

        nullable=True

    )



    status = Column(

        String,

        default="NOVO"

    )



    origem = Column(

        String,

        default="Manual"

    )



    observacao = Column(

        String,

        nullable=True

    )



    score = Column(

        Integer,

        default=0

    )



    prioridade = Column(

        String,

        default="MEDIA"

    )



    data_criacao = Column(

        DateTime,

        default=datetime.utcnow

    )



    # ==========================
    # RELACIONAMENTOS COMERCIAIS
    # ==========================


    followups = relationship(

        "Followup",

        back_populates="lead",

        cascade="all, delete"

    )



    historicos = relationship(

        "LeadHistorico",

        back_populates="lead",

        cascade="all, delete"

    )