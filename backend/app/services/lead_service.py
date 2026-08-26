def salvar_lead(dados):
    """
    Salva um lead novo ou informa que ele ja existe.

    Retorno:
        {
            "salvo": True/False,
            "duplicado": True/False,
            "lead": objeto ou None
        }
    """

    from app.database.database import SessionLocal
    from app.models.lead import Lead

    import re
    import unicodedata

    db = SessionLocal()

    try:

        def normalizar_texto(valor):
            if not valor:
                return ""

            valor = str(valor).strip().lower()

            valor = unicodedata.normalize(
                "NFKD",
                valor
            ).encode(
                "ascii",
                "ignore"
            ).decode(
                "ascii"
            )

            return re.sub(
                r"\s+",
                " ",
                valor
            )

        def normalizar_telefone(valor):
            if not valor:
                return ""

            return re.sub(
                r"\D",
                "",
                str(valor)
            )

        nome = dados.get("nome")
        empresa = dados.get("empresa") or nome
        telefone = dados.get("telefone")
        cidade = dados.get("cidade")

        telefone_normalizado = normalizar_telefone(telefone)
        empresa_normalizada = normalizar_texto(empresa)
        cidade_normalizada = normalizar_texto(cidade)

        # ====================================================
        # BARREIRA 1 - TELEFONE
        # ====================================================

        if telefone_normalizado:

            leads_existentes = db.query(Lead).all()

            for existente in leads_existentes:

                telefone_existente = normalizar_telefone(
                    existente.telefone
                )

                if (
                    telefone_existente
                    and telefone_existente == telefone_normalizado
                ):

                    return {
                        "salvo": False,
                        "duplicado": True,
                        "lead": existente
                    }

        # ====================================================
        # BARREIRA 2 - EMPRESA + CIDADE
        # ====================================================

        if empresa_normalizada and cidade_normalizada:

            leads_existentes = db.query(Lead).all()

            for existente in leads_existentes:

                empresa_existente = normalizar_texto(
                    existente.empresa
                )

                cidade_existente = normalizar_texto(
                    existente.cidade
                )

                if (
                    empresa_existente
                    and cidade_existente
                    and empresa_existente == empresa_normalizada
                    and cidade_existente == cidade_normalizada
                ):

                    return {
                        "salvo": False,
                        "duplicado": True,
                        "lead": existente
                    }

        # ====================================================
        # NOVO LEAD
        # ====================================================

        lead = Lead(
            nome=nome,
            empresa=empresa,
            telefone=telefone,
            email=dados.get("email"),
            cidade=cidade,
            segmento=(dados.get("segmento") or "").strip().lower(),
            origem="Google Maps",
            observacao=dados.get("observacao"),
            status="NOVO"
        )

        db.add(lead)
        db.commit()
        db.refresh(lead)

        return {
            "salvo": True,
            "duplicado": False,
            "lead": lead
        }

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()
