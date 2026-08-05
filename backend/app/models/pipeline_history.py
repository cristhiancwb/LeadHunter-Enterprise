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





class PipelineHistory(Base):

    __tablename__ = "pipeline_history"



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



    data = Column(

        DateTime,

        default=datetime.utcnow

    )





    lead = relationship(

        "Lead",

        back_populates="pipeline_history"

    )