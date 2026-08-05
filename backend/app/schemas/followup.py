from datetime import datetime

from pydantic import BaseModel





# =====================================
# BASE
# =====================================

class FollowupBase(BaseModel):

    titulo: str

    descricao: str | None = None

    observacao: str | None = None

    data_agendada: datetime | None = None





# =====================================
# CREATE
# =====================================

class FollowupCreate(FollowupBase):

    lead_id: int





# =====================================
# RESPONSE
# =====================================

class FollowupResponse(FollowupBase):

    id: int

    lead_id: int

    concluido: bool

    data_criacao: datetime

    data_conclusao: datetime | None = None




    class Config:

        from_attributes = True