from urllib.parse import quote

from app.collectors.browser import GoogleMapsBrowser
from app.collectors.parser import GoogleMapsParser


EMPRESA = "Pizzaria Baggio"
CIDADE = "Curitiba PR"


URL = (
    "https://www.google.com/maps/search/"
    + quote(f"{EMPRESA} {CIDADE}")
)


browser = GoogleMapsBrowser(
    headless=False,
    timeout=30000
)


try:

    page = browser.abrir()

    print()
    print("Abrindo pesquisa:")
    print(URL)

    parser = GoogleMapsParser(
        page=page,
        timeout=15000,
        tempo_carregamento=5000
    )

    resultado = parser.extrair(
        URL
    )


    print()
    print("=" * 60)
    print("RESULTADO FINAL")
    print("=" * 60)

    for campo, valor in resultado.items():

        print(
            f"{campo}: {valor}"
        )


    input(
        "\nENTER para fechar..."
    )


finally:

    browser.fechar()