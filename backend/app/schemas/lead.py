from pydantic import BaseModel


class LeadCreate(BaseModel):

    nome:str
    empresa:str
    telefone:str
    email:str
    cidade:str
    segmento:str



class LeadResponse(BaseModel):

    id:int
    nome:str
    empresa:str
    telefone:str
    email:str
    cidade:str
    segmento:str


    class Config:
        from_attributes=True