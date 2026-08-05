from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base



class LeadStatus(Base):

    __tablename__ = "lead_status"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    empresa = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )


    status = Column(
        String,
        default="NOVO"
    )


    atualizado_em = Column(
        DateTime,
        default=datetime.utcnow
    )