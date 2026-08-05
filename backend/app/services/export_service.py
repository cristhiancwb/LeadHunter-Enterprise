import csv
import os

from openpyxl import Workbook

from app.database.database import conectar



PASTA_EXPORT = "data/export"



def criar_pasta():

    if not os.path.exists(PASTA_EXPORT):

        os.makedirs(
            PASTA_EXPORT
        )



def buscar_leads():

    conn = conectar()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT
            empresa,
            telefone,
            endereco,
            cidade,
            categoria,
            avaliacao,
            site,
            score,
            prioridade,
            tem_site

        FROM leads

        ORDER BY
            score DESC

        """
    )


    dados = cursor.fetchall()


    conn.close()


    return dados



def exportar_excel(
    nome="leads_export.xlsx"
):

    criar_pasta()


    caminho = os.path.join(
        PASTA_EXPORT,
        nome
    )


    leads = buscar_leads()


    workbook = Workbook()

    sheet = workbook.active

    sheet.title = "Leads"



    cabecalho = [
        "Empresa",
        "Telefone",
        "Endereco",
        "Cidade",
        "Categoria",
        "Avaliacao",
        "Site",
        "Score",
        "Prioridade",
        "Tem Site"
    ]


    sheet.append(
        cabecalho
    )


    for lead in leads:

        sheet.append(
            lead
        )


    workbook.save(
        caminho
    )


    return caminho



def exportar_csv(
    nome="leads_export.csv"
):

    criar_pasta()


    caminho = os.path.join(
        PASTA_EXPORT,
        nome
    )


    leads = buscar_leads()


    with open(
        caminho,
        "w",
        newline="",
        encoding="utf-8"
    ) as arquivo:


        writer = csv.writer(
            arquivo
        )


        writer.writerow(
            [
                "Empresa",
                "Telefone",
                "Endereco",
                "Cidade",
                "Categoria",
                "Avaliacao",
                "Site",
                "Score",
                "Prioridade",
                "Tem Site"
            ]
        )


        writer.writerows(
            leads
        )


    return caminho