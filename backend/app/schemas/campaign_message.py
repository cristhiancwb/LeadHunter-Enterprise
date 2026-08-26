from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CampaignMessageGenerate(BaseModel):

    lead_ids: list[int]

    template_id: int | None = None

    canal: str | None = None

    agendado_em: datetime | None = None


class CampaignMessageStatusUpdate(BaseModel):

    status: str

    erro: str | None = None


class CampaignMessageResponse(BaseModel):

    id: int

    campaign_id: int

    lead_id: int

    template_id: int | None = None

    origem: str

    canal: str

    assunto: str | None = None

    mensagem: str

    status: str

    agendado_em: datetime | None = None

    enviado_em: datetime | None = None

    erro: str | None = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

