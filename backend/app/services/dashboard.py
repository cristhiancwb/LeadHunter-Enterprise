from fastapi import APIRouter

from app.services.dashboard_service import (
    obter_resumo_dashboard,
    obter_analytics_dashboard
)

from app.services.ranking_service import (
    listar_ranking
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)



@router.get("/resumo")
def resumo():

    return obter_resumo_dashboard()



@router.get("/ranking")
def ranking():

    return listar_ranking()



@router.get("/analytics")
def analytics():

    return obter_analytics_dashboard()