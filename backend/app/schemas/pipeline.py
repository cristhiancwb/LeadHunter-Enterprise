from pydantic import BaseModel


class PipelineStatusResponse(BaseModel):

    id: int
    nome: str
    quantidade: int


class PipelineUpdate(BaseModel):

    lead_id: int
    status: str