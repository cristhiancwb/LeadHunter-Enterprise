from app.collectors.browser import GoogleMapsBrowser

browser = GoogleMapsBrowser(
    headless=False
)

try:

    page = browser.abrir()

    browser.acessar(
        "https://www.google.com/maps"
    )

    print()

    print("Título:")
    print(page.title())

    print()

    print("URL:")
    print(page.url)

    browser.screenshot(
        "browser_ok.png"
    )

    input(
        "\nENTER para fechar..."
    )

finally:

    browser.fechar()