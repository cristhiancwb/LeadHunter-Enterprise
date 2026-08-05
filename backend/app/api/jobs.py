from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.services.job_service import buscar_job_por_id, criar_job

router = APIRouter(tags=["Jobs"])


class GoogleMapsJobRequest(BaseModel):
    keyword: str = Field(min_length=2, max_length=120)
    cidade: str = Field(min_length=2, max_length=120)


def serializar_job(job):
    return {
        "id": job.id,
        "tipo": job.tipo,
        "status": job.status,
        "progresso": job.progresso,
        "total": job.total,
        "erro": job.erro,
        "criado_em": job.criado_em,
        "iniciado_em": job.iniciado_em,
        "finalizado_em": job.finalizado_em,
    }


@router.post("/google-maps", status_code=status.HTTP_202_ACCEPTED)
def iniciar_google_maps(dados: GoogleMapsJobRequest):
    job = criar_job("GOOGLE_MAPS", f"{dados.keyword.strip()}|{dados.cidade.strip()}")
    return serializar_job(job)


@router.get("/{job_id}")
def status_job(job_id: int):
    job = buscar_job_por_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    return serializar_job(job)
