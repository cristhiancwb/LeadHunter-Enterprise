from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FollowupBase(BaseModel):

    tipo: str
    titulo: str
    descricao: str | None = None
    responsavel: str | None = None
    status: str
    concluido: bool = False
    data_agendada: datetime | None = None
    observacao: str | None = None
    usuario: str | None = None


class FollowupCreate(FollowupBase):

    lead_id: int


class FollowupUpdate(BaseModel):

    tipo: str | None = None
    titulo: str | None = None
    descricao: str | None = None
    responsavel: str | None = None
    status: str | None = None
    concluido: bool | None = None
    data_agendada: datetime | None = None
    data_conclusao: datetime | None = None
    observacao: str | None = None
    usuario: str | None = None


class FollowupResponse(FollowupBase):

    model_config = ConfigDict(from_attributes=True)

    id: int
    lead_id: int
    data_conclusao: datetime | None = None
    criado_em: datetime
    atualizado_em: datetime
