import traceback
from app.collectors.google_maps import GoogleMapsCollector


def importar_google_maps(keyword: str, city: str):
    try:
        coletor = GoogleMapsCollector()
        return coletor.search(keyword, city)

    except Exception:
        traceback.print_exc()
        raise