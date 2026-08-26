from urllib.parse import quote
import traceback

from app.collectors.browser import GoogleMapsBrowser
from app.collectors.parser import GoogleMapsParser

from app.services.lead_service import salvar_lead
from app.services.progress_service import atualizar_progresso


class GoogleMapsCollector:

    def executar(
        self,
        job_id,
        keyword,
        cidade,
        limite=20
    ):

        print(
            f"Buscando {keyword} em {cidade}"
        )

        resultados = self.search(
            keyword,
            cidade,
            limite=limite
        )

        total = len(resultados)

        novos_leads = 0
        duplicados = 0
        erros = 0

        if total == 0:

            print(
                "Nenhum resultado encontrado"
            )

            return {
                "total": 0,
                "novos": 0,
                "duplicados": 0,
                "erros": 0
            }

        for index, empresa in enumerate(resultados):

            try:

                resultado_salvamento = salvar_lead({
                    "nome": empresa.get("nome"),
                    "empresa": empresa.get("nome"),
                    "telefone": empresa.get("telefone"),
                    "cidade": cidade,
                    "segmento": keyword,
                    "observacao": empresa.get("site")
                })

                if not isinstance(resultado_salvamento, dict):
                    raise ValueError(
                        f"Retorno inesperado de salvar_lead: {resultado_salvamento!r}"
                    )

                if resultado_salvamento.get("duplicado") is True:
                    duplicados += 1
                    print(
                        "DUPLICADO:",
                        empresa.get("nome")
                    )

                elif resultado_salvamento.get("salvo") is True:
                    novos_leads += 1
                    print(
                        "NOVO LEAD:",
                        empresa.get("nome")
                    )

                else:
                    erros += 1
                    print(
                        "RETORNO INVALIDO AO SALVAR:",
                        empresa.get("nome"),
                        resultado_salvamento
                    )

            except Exception as erro:

                erros += 1

                print(
                    "ERRO AO SALVAR:",
                    empresa.get("nome")
                )

                print(erro)

            progresso = int(
                ((index + 1) / total) * 100
            )

            atualizar_progresso(
                job_id,
                progresso,
                total
            )

        print()
        print(
            f"Total coletado: {total}"
        )

        print(
            f"Novos leads: {novos_leads}"
        )

        print(
            f"Duplicados: {duplicados}"
        )

        print(
            f"Erros: {erros}"
        )

        return {
            "total": total,
            "novos": novos_leads,
            "duplicados": duplicados,
            "erros": erros
        }


    def search(
        self,
        keyword,
        cidade,
        limite=20
    ):

        empresas = []

        nomes_coletados = set()

        browser = GoogleMapsBrowser(
            headless=False,
            timeout=30000
        )

        try:

            page = browser.abrir()

            pesquisa = quote(
                f"{keyword} {cidade}"
            )

            url = (
                "https://www.google.com/maps/search/"
                + pesquisa
            )

            print(
                "Abrindo pesquisa:"
            )

            print(url)

            page.goto(
                url,
                wait_until="domcontentloaded"
            )

            page.wait_for_timeout(
                5000
            )

            page.wait_for_selector(
                "div[role='feed']",
                timeout=15000
            )

            print(
                "Lista encontrada"
            )

            feed = page.locator(
                "div[role='feed']"
            )

            for _ in range(8):

                feed.evaluate(
                    """
                    element => {
                        element.scrollTop =
                        element.scrollHeight;
                    }
                    """
                )

                page.wait_for_timeout(
                    2000
                )

            resultados = page.locator(
                "div[role='feed'] a"
            )

            quantidade = resultados.count()

            print(
                f"Resultados encontrados: {quantidade}"
            )

            links = []

            for i in range(
                min(
                    quantidade,
                    limite
                )
            ):

                href = resultados.nth(i).get_attribute(
                    "href"
                )

                if not href:
                    continue

                if "/place/" not in href:
                    continue

                if href.startswith("/"):

                    href = (
                        "https://www.google.com"
                        + href
                    )

                if href not in links:

                    links.append(
                        href
                    )

            print(
                f"Empresas para processar: {len(links)}"
            )

            parser = GoogleMapsParser(
                page=page,
                timeout=20000,
                tempo_carregamento=3000
            )

            for link in links:

                try:

                    print()
                    print(
                        "Abrindo:"
                    )

                    print(link)

                    page.goto(
                        link,
                        wait_until="domcontentloaded"
                    )

                    page.wait_for_timeout(
                        4000
                    )

                    empresa = parser.extrair(
                        page.url
                    )

                    nome = empresa.get(
                        "nome"
                    )

                    if not nome:
                        continue

                    if nome in nomes_coletados:
                        continue

                    nomes_coletados.add(
                        nome
                    )

                    empresas.append(
                        empresa
                    )

                    print(
                        "Coletado:",
                        nome
                    )

                    if len(empresas) >= limite:
                        break

                except Exception as erro:

                    print(
                        "Erro empresa:"
                    )

                    print(
                        erro
                    )

            print()

            print(
                f"Total coletado: {len(empresas)}"
            )

            return empresas

        except Exception:

            print(
                "Erro no coletor Google Maps"
            )

            traceback.print_exc()

            return []

        finally:

            browser.fechar()
