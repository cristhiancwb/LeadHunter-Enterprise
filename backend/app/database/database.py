from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
DATABASE_PATH = BASE_DIR / "leadhunter_clean.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Mantido por compatibilidade com os arquivos novos
def conectar():
    yield from get_db()


def criar_tabelas():
    from app.models.lead import Lead
    from app.models.followup import Followup
    from app.models.lead_historico import LeadHistorico
    from app.models.job import Job

    Base.metadata.create_all(bind=engine)




