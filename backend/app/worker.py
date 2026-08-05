import time

from app.database.database import criar_tabelas

from app.services.job_service import (
    buscar_proximo_job,
    atualizar_status
)

from app.workers.collector_worker import executar_google_maps



def executar():

    print("LeadHunter Worker iniciado")


    while True:

        job = buscar_proximo_job()


        if job:

            job_id = job.id

            print(
                "Executando Job:",
                job_id
            )


            if job.tipo == "GOOGLE_MAPS":

                executar_google_maps(job)


            else:

                print(
                    "Tipo de job não suportado:",
                    job[1]
                )


        else:

            time.sleep(5)



if __name__ == "__main__":

    criar_tabelas()

    executar()
