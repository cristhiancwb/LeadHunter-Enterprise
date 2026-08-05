def calcular_score(
    telefone=None,
    site=None,
    avaliacao=None
):

    score = 0


    # Possui telefone
    if telefone:
        score += 30


    # Possui site
    if site:
        score += 25


    # Avaliação Google
    if avaliacao:

        try:

            nota = float(
                avaliacao.replace(",", ".")
            )


            if nota >= 4.5:
                score += 30

            elif nota >= 4:
                score += 20

            else:
                score += 10


        except Exception:
            pass


    # Classificação

    if score >= 80:
        prioridade = "ALTA"

    elif score >= 50:
        prioridade = "MEDIA"

    else:
        prioridade = "BAIXA"


    tem_site = "SIM" if site else "NAO"


    return {
        "score": score,
        "prioridade": prioridade,
        "tem_site": tem_site
    }