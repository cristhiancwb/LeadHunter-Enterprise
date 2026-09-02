from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):

    nome: str
    sku: Optional[str] = None
    categoria: Optional[str] = None
    descricao: Optional[str] = None

    preco: float = 0
    custo: float = 0
    estoque: int = 0

    ativo: bool = True

    imagem_principal: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):

    id: int

    model_config = ConfigDict(
        from_attributes=True
    )