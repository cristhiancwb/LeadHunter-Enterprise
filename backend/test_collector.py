from app.collectors.google_maps import GoogleMapsCollector


collector = GoogleMapsCollector()


resultado = collector.search(
    "pizzaria",
    "Curitiba",
    5
)


for lead in resultado:
    print(lead)