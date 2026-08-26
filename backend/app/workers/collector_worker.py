from app.collectors.google_maps import GoogleMapsCollector

from app.services.job_service import atualizar_status


def executar_google_maps(job):

    job_id = job.id

    try:

        parametro = job.parametro

        partes = parametro.split("|")

        keyword = partes[0].strip()

        cidade = (
            partes[1].strip()
            if len(partes) > 1
            else ""
        )

        limite = (
            int(partes[2].strip())
            if len(partes) > 2 and partes[2].strip()
            else 20
        )

        if limite <= 0:
            raise ValueError(
                "Limite da coleta deve ser maior que zero."
            )

        if limite > 500:
            raise ValueError(
                "Limite máximo permitido: 500."
            )

        print(
            "=" * 60
        )

        print(
            "JOB RECEBIDO:",
            job_id
        )

        print(
            "BUSCA:",
            keyword,
            cidade
        )

        print(
            "=" * 60
        )

        print(
            "Criando GoogleMapsCollector..."
        )

        collector = GoogleMapsCollector()

        print(
            "Executando coletor..."
        )

        resultado = collector.executar(
            job_id,
            keyword,
            cidade,
            limite=limite
        )

        # ====================================================
        # CONTADORES REAIS DA COLETA
        # ====================================================

        if isinstance(resultado, dict):

            total = resultado.get(
                "total",
                0
            )

            novos = resultado.get(
                "novos",
                0
            )

            duplicados = resultado.get(
                "duplicados",
                0
            )

            erros = resultado.get(
                "erros",
                0
            )

        else:

            # Compatibilidade com retorno antigo
            total = resultado
            novos = 0
            duplicados = 0
            erros = 0

        print(
            "Total coletado:",
            total
        )

        print(
            "Novos leads:",
            novos
        )

        print(
            "Duplicados:",
            duplicados
        )

        print(
            "Erros:",
            erros
        )

        atualizar_status(
            job_id,
            "finished",
            100
        )

        return resultado

    except Exception as erro:

        print(
            "ERRO NO WORKER GOOGLE MAPS"
        )

        print(
            erro
        )

        atualizar_status(
            job_id,
            "failed",
            0,
            str(erro)
        )

        return 0
