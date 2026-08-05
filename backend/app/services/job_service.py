from datetime import datetime

from app.database.database import SessionLocal
from app.models.job import Job


def criar_job(tipo, parametro):
    db = SessionLocal()
    try:
        job = Job(tipo=tipo, parametro=parametro, status="queued")
        db.add(job)
        db.commit()
        db.refresh(job)
        return job
    finally:
        db.close()


def buscar_job_por_id(job_id):
    db = SessionLocal()
    try:
        return db.query(Job).filter(Job.id == job_id).first()
    finally:
        db.close()


def buscar_proximo_job():
    db = SessionLocal()
    try:
        job = (
            db.query(Job)
            .filter(Job.status == "queued")
            .order_by(Job.criado_em.asc())
            .first()
        )
        if not job:
            return None

        job.status = "running"
        job.iniciado_em = datetime.utcnow()
        db.commit()
        db.refresh(job)
        db.expunge(job)
        return job
    finally:
        db.close()


def atualizar_status(job_id, status, progresso=None, erro=None):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return None

        job.status = status
        if progresso is not None:
            job.progresso = progresso
        if erro is not None:
            job.erro = erro
        if status in {"finished", "failed"}:
            job.finalizado_em = datetime.utcnow()
        db.commit()
        db.refresh(job)
        return job
    finally:
        db.close()


def atualizar_progresso(job_id, progresso, total=0):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return None
        job.progresso = max(0, min(100, int(progresso)))
        job.total = max(0, int(total))
        db.commit()
        return job
    finally:
        db.close()
