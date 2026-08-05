from playwright.sync_api import (
    sync_playwright,
    TimeoutError as PlaywrightTimeoutError
)


class GoogleMapsBrowser:
    """
    Gerencia a sessão do navegador Playwright.

    Responsabilidades:
    - iniciar Playwright
    - abrir Chromium
    - criar contexto
    - criar página
    - encerrar tudo corretamente
    """

    def __init__(
        self,
        headless: bool = False,
        timeout: int = 30000,
        slow_mo: int = 0
    ):

        self.headless = headless
        self.timeout = timeout
        self.slow_mo = slow_mo

        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None

    def abrir(self):

        print("=" * 60)
        print("LeadHunter Enterprise")
        print("Inicializando navegador...")
        print("=" * 60)

        self.playwright = sync_playwright().start()

        self.browser = self.playwright.chromium.launch(
            headless=self.headless,
            slow_mo=self.slow_mo,
            args=[
                "--start-maximized",
                "--disable-blink-features=AutomationControlled"
            ]
        )

        self.context = self.browser.new_context(
            viewport={"width": 1600, "height": 900},
            locale="pt-BR",
            timezone_id="America/Sao_Paulo"
        )

        self.page = self.context.new_page()

        self.page.set_default_timeout(self.timeout)

        print("Chromium iniciado.")

        return self.page

    def acessar(self, url: str):

        if self.page is None:
            raise RuntimeError(
                "Navegador não foi iniciado."
            )

        print(f"Acessando:\n{url}")

        self.page.goto(
            url,
            wait_until="domcontentloaded"
        )

        return self.page

    def esperar(self, ms: int):

        if self.page:
            self.page.wait_for_timeout(ms)

    def screenshot(
        self,
        arquivo="debug.png",
        full_page=True
    ):

        if self.page:

            self.page.screenshot(
                path=arquivo,
                full_page=full_page
            )

            print(f"Screenshot salva em: {arquivo}")

    def html(self):

        if self.page:
            return self.page.content()

        return ""

    def fechar(self):

        print("Encerrando navegador...")

        try:

            if self.context:
                self.context.close()

        except Exception:
            pass

        try:

            if self.browser:
                self.browser.close()

        except Exception:
            pass

        try:

            if self.playwright:
                self.playwright.stop()

        except Exception:
            pass

        self.page = None
        self.context = None
        self.browser = None
        self.playwright = None

        print("Navegador encerrado.")