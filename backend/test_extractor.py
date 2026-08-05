from app.collectors.browser import (
    GoogleMapsBrowser
)

from app.collectors.extractor import (
    GoogleMapsExtractor
)


browser = GoogleMapsBrowser(
    headless=False,
    timeout=30000
)


try:

    page = browser.abrir()

    extractor = GoogleMapsExtractor(
        page=page,
        max_resultados=10,
        max_scrolls=10,
        pausa_scroll=2000
    )

    links = extractor.pesquisar(
        keyword="Pizzaria",
        cidade="Curitiba"
    )

    print()
    print("=" * 60)
    print("RESULTADO FINAL")
    print("=" * 60)

    print()

    for numero, link in enumerate(
        links,
        start=1
    ):

        print(
            f"{numero}. {link}"
        )

    print()

    print(
        f"TOTAL: {len(links)}"
    )

    input(
        "\nENTER para fechar..."
    )

finally:

    browser.fechar()