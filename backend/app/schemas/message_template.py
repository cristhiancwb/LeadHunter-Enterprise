from datetime import datetime

from pydantic import BaseModel, ConfigDict



# =====================================
# BASE
# =====================================

class MessageTemplateBase(BaseModel):

    nome: str

    categoria: str | None = None

    canal: str

    titulo: str | None = None

    conteudo: str

    variaveis: str | None = None

    ativo: bool = True



# =====================================
# CREATE
# =====================================

class MessageTemplateCreate(MessageTemplateBase):

    pass



# =====================================
# UPDATE
# =====================================

class MessageTemplateUpdate(BaseModel):

    nome: str | None = None

    categoria: str | None = None

    canal: str | None = None

    titulo: str | None = None

    conteudo: str | None = None

    variaveis: str | None = None

    ativo: bool | None = None



# =====================================
# RESPONSE
# =====================================

class MessageTemplateResponse(MessageTemplateBase):

    id: int

    created_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )