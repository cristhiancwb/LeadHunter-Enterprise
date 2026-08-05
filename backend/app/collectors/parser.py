import time
import traceback


class GoogleMapsParser:

    def __init__(
        self,
        page,
        timeout=15000,
        tempo_carregamento=5000
    ):

        self.page = page
        self.timeout = timeout
        self.tempo_carregamento = tempo_carregamento


    def extrair(self, url):

        resultado = {
            "nome": None,
            "endereco": None,
            "telefone": None,
            "site": None,
            "categoria": None,
            "avaliacao": None,
            "url": None
        }


        try:

            print()
            print("Abrindo Google Maps:")
            print(url)


            self.page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=self.timeout
            )


            self.page.wait_for_timeout(
                self.tempo_carregamento
            )


            print(
                "Página carregada:"
            )

            print(
                self.page.url
            )


            # ==================================================
            # AGUARDA RESULTADOS
            # ==================================================

            try:

                self.page.wait_for_selector(
                    "div[role='feed']",
                    timeout=10000
                )

                print(
                    "Lista de resultados encontrada"
                )


            except Exception:

                print(
                    "Lista de resultados não encontrada"
                )


            # ==================================================
            # CLICA PRIMEIRO RESULTADO
            # ==================================================

            try:

                resultados = self.page.locator(
                    "div[role='feed'] a"
                )


                quantidade = resultados.count()


                print(
                    f"Resultados encontrados: {quantidade}"
                )


                if quantidade > 0:

                    resultados.first.click()


                    print(
                        "Primeiro resultado selecionado"
                    )


                    self.page.wait_for_timeout(
                        5000
                    )


                    print(
                        "URL após clique:"
                    )

                    print(
                        self.page.url
                    )


            except Exception as erro:

                print(
                    "Erro ao selecionar resultado:"
                )

                print(
                    erro
                )



            resultado["url"] = self.page.url



            # ==================================================
            # EXTRAÇÃO DOS DADOS
            # ==================================================

            resultado["nome"] = self._buscar_texto(
                "h1.DUwDvf"
            )


            if not resultado["nome"]:

                resultado["nome"] = self._buscar_texto(
                    "h1"
                )



            resultado["categoria"] = self._buscar_texto(
                "button[jsaction*='category']"
            )


            resultado["endereco"] = self._buscar_texto(
                "button[data-item-id='address']"
            )


            resultado["telefone"] = self._buscar_texto(
                "button[data-item-id*='phone']"
            )


            resultado["site"] = self._buscar_texto(
                "a[data-item-id='authority']"
            )


            resultado["avaliacao"] = self._buscar_texto(
                "div.F7nice span"
            )



            return resultado



        except Exception:

            print(
                "ERRO NO PARSER"
            )

            traceback.print_exc()


            return resultado



    # ==================================================
    # LIMPEZA E CAPTURA DE TEXTO
    # ==================================================

    def _buscar_texto(
        self,
        seletor
    ):

        try:

            elemento = self.page.locator(
                seletor
            ).first


            if elemento.count() > 0:

                texto = elemento.inner_text(
                    timeout=3000
                )


                texto = (
                    texto
                    .replace("", "")
                    .replace("", "")
                    .replace("", "")
                    .replace("\n", " ")
                    .strip()
                )


                return texto



        except Exception:

            pass


        return None