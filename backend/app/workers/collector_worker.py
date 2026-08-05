from app.collectors.google_maps import GoogleMapsCollector

from app.services.job_service import atualizar_status



def executar_google_maps(job):


    job_id = job[0]


    try:


        parametro = job.parametro


        partes = parametro.split("|")


        keyword = partes[0].strip()


        cidade = (
            partes[1].strip()
            if len(partes) > 1
            else ""
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


        total = collector.executar(
            job_id,
            keyword,
            cidade
        )



        print(
            "Total coletado:",
            total
        )



        atualizar_status(
            job_id,
            "finished",
            100
        )



        return total



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
