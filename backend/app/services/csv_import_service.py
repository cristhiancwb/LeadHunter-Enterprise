import csv


def importar_csv(caminho):

    dados = []

    with open(
        caminho,
        encoding="utf-8"
    ) as arquivo:

        leitor = csv.DictReader(arquivo)

        for linha in leitor:
            dados.append(linha)

    return dados