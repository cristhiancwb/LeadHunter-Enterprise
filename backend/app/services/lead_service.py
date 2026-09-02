from app.services.lead_score_service import calcular_score

import re
import unicodedata

from app.database.database import SessionLocal
from app.models.lead import Lead


def normalizar_texto(valor):
    if not valor:
        return ""

    texto = str(valor).strip().lower()

    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(
        caractere
        for caractere in texto
        if not unicodedata.combining(caractere)
    )

    texto = re.sub(r"\s+", " ", texto)

    return texto


def normalizar_telefone(valor):
    if not valor:
        return ""

    return re.sub(r"\D", "", str(valor))


def buscar_lead_existente(db, dados):
    telefone = normalizar_telefone(dados.get("telefone"))

    empresa = (
        dados.get("empresa")
        or dados.get("nome")
        or ""
    )

    cidade = dados.get("cidade") or ""

    empresa_normalizada = normalizar_texto(empresa)
    cidade_normalizada = normalizar_texto(cidade)

    # 1. Telefone e a chave mais forte de duplicidade.
    if telefone:
        leads = db.query(Lead).filter(
            Lead.telefone.isnot(None)
        ).all()

        for lead in leads:
            if normalizar_telefone(lead.telefone) == telefone:
                return lead

    # 2. Empresa + cidade evita repetir empresas sem telefone.
    if empresa_normalizada and cidade_normalizada:
        leads = db.query(Lead).filter(
            Lead.cidade.isnot(None)
        ).all()

        for lead in leads:
            empresa_existente = normalizar_texto(
                lead.empresa or lead.nome or ""
            )

            cidade_existente = normalizar_texto(
                lead.cidade or ""
            )

            if (
                empresa_existente == empresa_normalizada
                and cidade_existente == cidade_normalizada
            ):
                return lead

    return None


def salvar_lead(dados):
    """
    Salva um lead coletado.

    Se o lead ja existir por telefone ou por empresa + cidade,
    retorna o registro existente sem criar duplicata.
    """

    db = SessionLocal()

    try:
        existente = buscar_lead_existente(db, dados)

        resultado_score = calcular_score(
            telefone=dados.get("telefone"),
            site=dados.get("observacao"),
            avaliacao=dados.get("avaliacao")
        )

        if existente:
            existente.score = resultado_score["score"]
            existente.prioridade = resultado_score["prioridade"]

            db.commit()
            db.refresh(existente)

            return existente

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
            score=resultado_score["score"],
            prioridade=resultado_score["prioridade"],
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

