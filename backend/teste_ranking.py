from app.services.ranking_service import listar_top_leads



print("=" * 60)
print("TOP LEADS - LEADHUNTER ENTERPRISE")
print("=" * 60)


leads = listar_top_leads(10)


for lead in leads:

    print()

    print(
        "Empresa:",
        lead[1]
    )

    print(
        "Telefone:",
        lead[2]
    )

    print(
        "Avaliação:",
        lead[5]
    )

    print(
        "Score:",
        lead[6]
    )

    print(
        "Prioridade:",
        lead[7]
    )

    print(
        "Site:",
        lead[8]
    )

    print("-" * 40)