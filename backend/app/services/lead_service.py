def salvar_lead(dados):
    """
    Compatibilidade com collector Google Maps

    Recebe dados coletados e salva como Lead
    """

    from app.database.database import SessionLocal
    from app.models.lead import Lead


    db = SessionLocal()

    try:

        lead = Lead(

            nome=dados.get("nome"),

            empresa=dados.get("empresa")
            or dados.get("nome"),

            telefone=dados.get("telefone"),

            email=dados.get("email"),

            cidade=dados.get("cidade"),

            segmento=dados.get("segmento"),

            origem="Google Maps",

            observacao=dados.get("observacao"),

            status="NOVO"

        )


        db.add(lead)

        db.commit()

        db.refresh(lead)


        return lead


    except Exception as e:

        db.rollback()

        raise e


    finally:

        db.close()