from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default="queued", index=True)
    parametro = Column(Text, nullable=False)
    progresso = Column(Integer, nullable=False, default=0)
    total = Column(Integer, nullable=False, default=0)
    erro = Column(Text, nullable=True)
    criado_em = Column(DateTime, nullable=False, default=datetime.utcnow)
    iniciado_em = Column(DateTime, nullable=True)
    finalizado_em = Column(DateTime, nullable=True)
