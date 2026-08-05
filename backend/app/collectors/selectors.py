class GoogleMapsSelectors:
    """
    Seletores centralizados do Google Maps.

    Todos os coletores devem importar os seletores
    deste arquivo.

    Se o Google Maps alterar o HTML, a manutenção
    será feita aqui, sem alterar extractor.py
    ou parser.py.
    """

    # ==================================================
    # PESQUISA
    # ==================================================

    SEARCH_INPUT = [
        "input#searchboxinput",
        "input[aria-label*='Pesquisar']",
        "input[aria-label*='Search']",
        "input[placeholder*='Pesquisar']",
        "input[placeholder*='Search']",
    ]

    SEARCH_BUTTON = [
        "button#searchbox-searchbutton",
        "button[aria-label*='Pesquisar']",
        "button[aria-label*='Search']",
    ]

    # ==================================================
    # LISTA DE RESULTADOS
    # ==================================================

    RESULTS_FEED = [
        "div[role='feed']",
        "div[aria-label*='Resultados']",
        "div[aria-label*='Results']",
    ]

    RESULT_LINKS = [
        "div[role='feed'] a[href*='/maps/place/']",
        "a[href*='/maps/place/']",
    ]

    # ==================================================
    # PÁGINA DA EMPRESA
    # ==================================================

    BUSINESS_NAME = [
        "h1.DUwDvf",
        "h1[role='heading']",
        "h1",
    ]

    CATEGORY = [
        "button.DkEaL",
        "button[jsaction*='category']",
        "button[aria-label*='Categoria']",
    ]

    ADDRESS = [
        "button[data-item-id='address']",
        "button[data-item-id*='address']",
        "button[aria-label*='Endereço']",
        "button[aria-label*='Address']",
    ]

    PHONE = [
        "button[data-item-id*='phone']",
        "button[aria-label*='Telefone']",
        "button[aria-label*='Phone']",
    ]

    WEBSITE = [
        "a[data-item-id='authority']",
        "a[data-item-id*='authority']",
        "a[aria-label*='Website']",
        "a[aria-label*='Site']",
    ]

    # ==================================================
    # AVALIAÇÃO
    # ==================================================

    RATING = [
        "div.F7nice span[aria-hidden='true']",
        "span[aria-label*='estrela']",
        "span[aria-label*='star']",
    ]

    REVIEW_COUNT = [
        "div.F7nice span",
        "button[aria-label*='avaliações']",
        "button[aria-label*='reviews']",
    ]

    # ==================================================
    # DETECÇÃO DE ESTADOS
    # ==================================================

    NO_RESULTS = [
        "div[role='main']",
        "div[aria-label*='Nenhum resultado']",
        "div[aria-label*='No results']",
    ]

    CONSENT_BUTTON = [
        "button:has-text('Aceitar tudo')",
        "button:has-text('Aceitar')",
        "button:has-text('Accept all')",
        "button:has-text('I agree')",
    ]

    # ==================================================
    # UTILITÁRIOS
    # ==================================================

    @classmethod
    def todos(cls, nome: str) -> list[str]:
        """
        Retorna uma lista de seletores pelo nome.

        Exemplo:
            GoogleMapsSelectors.todos(
                "BUSINESS_NAME"
            )
        """

        seletores = getattr(
            cls,
            nome,
            []
        )

        return list(seletores)