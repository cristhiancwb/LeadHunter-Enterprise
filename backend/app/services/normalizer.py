import re


def limpar_telefone(numero: str):

    return re.sub(r"\D", "", numero)


def limpar_email(email: str):

    return email.lower().strip()


def limpar_texto(texto: str):

    return texto.strip().title()