from urllib.parse import quote_plus

from playwright.sync_api import (
    TimeoutError as PlaywrightTimeoutError
)

from app.collectors.selectors import (
    GoogleMapsSelectors
)


class GoogleMapsExtractor:
    """
    Responsável por:

    - montar a pesquisa;
    - abrir o Google Maps;
    - localizar a lista de resultados;
    - fazer scroll;
    - coletar links únicos das empresas.
    """

    def __init__(
        self,
        page,
        max_resultados=50,
        max_scrolls=20,
        pausa_scroll=1500
    ):

        self.page = page

        self.max_resultados = max_resultados
        self.max_scrolls = max_scrolls
        self.pausa_scroll = pausa_scroll

    def pesquisar(
        self,
        keyword,
        cidade
    ):

        consulta = (
            f"{keyword} {cidade}"
        ).strip()

        print()
        print("=" * 60)
        print("PESQUISA GOOGLE MAPS")
        print("=" * 60)
        print(f"Consulta: {consulta}")

        self._abrir_pesquisa(
            consulta
        )

        self._aceitar_cookies()

        feed = self._localizar_feed()

        if feed is None:

            print(
                "Lista de resultados não encontrada."
            )

            return []

        links = self._coletar_links(
            feed
        )

        print()
        print(
            f"Total de links únicos: {len(links)}"
        )

        return links

    def _abrir_pesquisa(
        self,
        consulta
    ):

        consulta_url = quote_plus(
            consulta
        )

        url = (
            "https://www.google.com/maps/"
            f"search/{consulta_url}"
        )

        print()
        print("Abrindo pesquisa:")
        print(url)

        self.page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=60000
        )

        self.page.wait_for_timeout(
            5000
        )

        print()
        print("Página atual:")
        print(self.page.url)

        print()
        print("Título:")
        print(self.page.title())

    def _aceitar_cookies(self):

        for seletor in (
            GoogleMapsSelectors.CONSENT_BUTTON
        ):

            try:

                botao = self.page.locator(
                    seletor
                ).first

                if botao.is_visible(
                    timeout=2000
                ):

                    print(
                        "Aceitando cookies..."
                    )

                    botao.click()

                    self.page.wait_for_timeout(
                        1500
                    )

                    return

            except Exception:

                continue

    def _localizar_feed(self):

        print()
        print(
            "Localizando lista de resultados..."
        )

        for seletor in (
            GoogleMapsSelectors.RESULTS_FEED
        ):

            try:

                feed = self.page.locator(
                    seletor
                ).first

                feed.wait_for(
                    state="visible",
                    timeout=15000
                )

                print(
                    f"Lista encontrada: {seletor}"
                )

                return feed

            except PlaywrightTimeoutError:

                continue

            except Exception:

                continue

        return None

    def _coletar_links(
        self,
        feed
    ):

        links = []

        links_vistos = set()

        tentativas_sem_novos = 0

        print()
        print(
            "Iniciando coleta..."
        )

        for numero_scroll in range(
            1,
            self.max_scrolls + 1
        ):

            novos = self._extrair_links_visiveis(
                links_vistos
            )

            for link in novos:

                links.append(
                    link
                )

                links_vistos.add(
                    link
                )

                print(
                    f"Link {len(links)}:"
                )

                print(link)

                if (
                    len(links)
                    >= self.max_resultados
                ):

                    print()
                    print(
                        "Limite de resultados atingido."
                    )

                    return links

            if novos:

                tentativas_sem_novos = 0

            else:

                tentativas_sem_novos += 1

            print()
            print(
                f"Scroll {numero_scroll}/"
                f"{self.max_scrolls}"
            )

            print(
                f"Resultados únicos: "
                f"{len(links)}"
            )

            if (
                tentativas_sem_novos >= 3
            ):

                print(
                    "Nenhum resultado novo "
                    "após 3 tentativas."
                )

                break

            try:

                feed.evaluate(
                    """
                    elemento => {
                        elemento.scrollTop =
                            elemento.scrollHeight;
                    }
                    """
                )

            except Exception:

                self.page.mouse.wheel(
                    0,
                    2500
                )

            self.page.wait_for_timeout(
                self.pausa_scroll
            )

        return links

    def _extrair_links_visiveis(
        self,
        links_vistos
    ):

        encontrados = []

        for seletor in (
            GoogleMapsSelectors.RESULT_LINKS
        ):

            try:

                elementos = self.page.locator(
                    seletor
                )

                total = elementos.count()

                for indice in range(total):

                    elemento = elementos.nth(
                        indice
                    )

                    href = elemento.get_attribute(
                        "href"
                    )

                    href = self._normalizar_link(
                        href
                    )

                    if (
                        not href
                        or href in links_vistos
                        or href in encontrados
                    ):

                        continue

                    encontrados.append(
                        href
                    )

            except Exception:

                continue

        return encontrados

    def _normalizar_link(
        self,
        href
    ):

        if not href:

            return ""

        href = href.strip()

        if (
            href.startswith(
                "/maps/place/"
            )
        ):

            href = (
                "https://www.google.com"
                + href
            )

        if (
            not href.startswith(
                "http"
            )
        ):

            return ""

        if (
            "/maps/place/"
            not in href
        ):

            return ""

        return href