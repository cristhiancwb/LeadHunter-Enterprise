from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./leadhunter.db"

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
