from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base



class LeadHistorico(Base):

    __tablename__ = "lead_historicos"


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


    status_anterior = Column(

        String,

        nullable=True

    )


    status_novo = Column(

        String,

        nullable=False

    )


    data_alteracao = Column(

        DateTime,

        default=datetime.utcnow

    )


    observacao = Column(

        String,

        nullable=True

    )


    lead = relationship(

        "Lead",

        back_populates="historicos"

    )