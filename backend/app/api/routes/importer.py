from fastapi import APIRouter
from app.collectors.google_maps import GoogleMapsCollector

router = APIRouter(prefix="/importer", tags=["Importador"])


@router.get("/google")
def importar(keyword: str, city: str):

    coletor = GoogleMapsCollector()

    dados = coletor.search(keyword, city)

    return {
        "ok": True,
        "dados": dados
    }