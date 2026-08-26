from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CampaignBase(BaseModel):

    nome: str

    descricao: str | None = None

    objetivo: str | None = None

    status: str = "DRAFT"

    canal: str | None = None

    ativa: bool = False

    data_inicio: datetime | None = None

    data_fim: datetime | None = None


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):

    nome: str | None = None

    descricao: str | None = None

    objetivo: str | None = None

    status: str | None = None

    canal: str | None = None

    ativa: bool | None = None

    data_inicio: datetime | None = None

    data_fim: datetime | None = None


class CampaignStatusUpdate(BaseModel):

    status: str

    ativa: bool | None = None


class CampaignResponse(CampaignBase):

    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
