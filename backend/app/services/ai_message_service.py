import os

from dotenv import load_dotenv

import httpx


load_dotenv()


class AIMessageService:

    @staticmethod
    def disponivel() -> bool:
        return bool(
            os.getenv("OPENAI_API_KEY")
        )

    @staticmethod
    def gerar_mensagem(
        contexto: str,
        modelo: str | None = None,
    ) -> str:

        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY nao configurada."
            )

        modelo = (
            modelo
            or os.getenv(
                "OPENAI_MODEL",
                "gpt-4o-mini",
            )
        )

        payload = {
            "model": modelo,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "Voce e um assistente comercial "
                        "especializado em prospeccao B2B. "
                        "Gere mensagens naturais, objetivas "
                        "e personalizadas. "
                        "Nao invente informacoes."
                    ),
                },
                {
                    "role": "user",
                    "content": contexto,
                },
            ],
            "temperature": 0.7,
        }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        response = httpx.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60.0,
        )

        response.raise_for_status()

        dados = response.json()

        return (
            dados["choices"][0]["message"]["content"]
            .strip()
        )