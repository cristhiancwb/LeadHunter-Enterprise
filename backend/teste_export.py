from app.services.export_service import (
    exportar_excel,
    exportar_csv
)


print("=" * 60)
print("EXPORTAÇÃO LEADHUNTER ENTERPRISE")
print("=" * 60)


arquivo_excel = exportar_excel()

print(
    "Excel criado:",
    arquivo_excel
)


arquivo_csv = exportar_csv()

print(
    "CSV criado:",
    arquivo_csv
)