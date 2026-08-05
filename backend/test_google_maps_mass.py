from app.collectors.google_maps import GoogleMapsCollector


collector = GoogleMapsCollector()


leads = collector.search(
    "pizzaria",
    "Curitiba",
    limite=10
)


print()
print("=" * 60)
print("LEADS ENCONTRADOS")
print("=" * 60)


for lead in leads:

    print()
    print(lead)