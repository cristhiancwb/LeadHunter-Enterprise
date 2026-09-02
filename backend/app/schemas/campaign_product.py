from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CampaignProductCreate(BaseModel):

    product_id: int

    preco_oferta: float | None = None

    quantidade_oferta: int | None = None


class CampaignProductUpdate(BaseModel):

    preco_oferta: float | None = None

    quantidade_oferta: int | None = None

    ativo: bool | None = None


class CampaignProductResponse(BaseModel):

    id: int

    campaign_id: int

    product_id: int

    preco_oferta: float | None = None

    quantidade_oferta: int | None = None

    ativo: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
