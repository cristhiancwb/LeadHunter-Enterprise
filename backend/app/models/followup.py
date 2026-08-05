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



    titulo = Column(

        String(255),

        nullable=False

    )



    descricao = Column(

        Text,

        nullable=True

    )



    observacao = Column(

        Text,

        nullable=True

    )



    data_agendada = Column(

        DateTime,

        nullable=True

    )



    concluido = Column(

        Boolean,

        default=False

    )



    data_criacao = Column(

        DateTime,

        default=datetime.utcnow

    )



    data_conclusao = Column(

        DateTime,

        nullable=True

    )




    lead = relationship(

        "Lead",

        back_populates="followups"

    )