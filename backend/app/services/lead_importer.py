from app.database.database import conectar
from app.models.lead import Lead



def importar_leads(lista_leads):

    db = conectar()

    cadastrados = 0


    try:

        for item in lista_leads:


            lead_existente = (
                db.query(Lead)
                .filter(
                    Lead.telefone == item.get("telefone")
                )
                .first()
            )


            if lead_existente:
                continue



            novo_lead = Lead(

                nome=item.get(
                    "empresa",
                    "Sem nome"
                ),

                empresa=item.get(
                    "empresa"
                ),

                telefone=item.get(
                    "telefone"
                ),

                cidade=item.get(
                    "cidade"
                ),

                segmento=item.get(
                    "segmento"
                ),

                score=item.get(
                    "score",
                    0
                ),

                prioridade=item.get(
                    "prioridade",
                    "BAIXA"
                ),

                status="NOVO",

                origem="Google Maps"

            )


            db.add(
                novo_lead
            )

            cadastrados += 1



        db.commit()


        return {

            "importados": cadastrados

        }


    finally:

        db.close()