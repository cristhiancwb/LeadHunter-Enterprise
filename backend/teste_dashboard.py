from app.services.dashboard_service import resumo_dashboard


print("=" * 60)
print("DASHBOARD LEADHUNTER ENTERPRISE")
print("=" * 60)


dados = resumo_dashboard()


for chave, valor in dados.items():

    print()

    print(
        chave,
        ":",
        valor
    )