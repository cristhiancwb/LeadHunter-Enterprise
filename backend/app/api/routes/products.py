from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from app.services.product_service import ProductService


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.get(
    "",
    response_model=list[ProductResponse],
)
def listar_produtos(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    categoria: str | None = None,
    ativo: bool | None = None,
    ordenar: str = "nome",
    ordem: str = "asc",
    db: Session = Depends(get_db),
):

    return ProductService.listar_produtos(
        db=db,
        skip=skip,
        limit=limit,
        categoria=categoria,
        ativo=ativo,
        ordenar=ordenar,
        ordem=ordem,
    )


@router.get(
    "/search",
    response_model=list[ProductResponse],
)
def pesquisar_produtos(
    nome: str,
    db: Session = Depends(get_db),
):

    return ProductService.buscar_por_nome(
        db,
        nome,
    )


@router.get(
    "/{produto_id}",
    response_model=ProductResponse,
)
def buscar_produto(
    produto_id: int,
    db: Session = Depends(get_db),
):

    produto = ProductService.buscar_produto(
        db,
        produto_id,
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto n├úo encontrado",
        )

    return produto


@router.post(
    "",
    response_model=ProductResponse,
    status_code=201,
)
def criar_produto(
    dados: ProductCreate,
    db: Session = Depends(get_db),
):

    return ProductService.criar_produto(
        db,
        dados,
    )


@router.put(
    "/{produto_id}",
    response_model=ProductResponse,
)
def atualizar_produto(
    produto_id: int,
    dados: ProductUpdate,
    db: Session = Depends(get_db),
):

    produto = ProductService.buscar_produto(
        db,
        produto_id,
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto n├úo encontrado",
        )

    return ProductService.atualizar_produto(
        db,
        produto,
        dados,
    )


@router.delete(
    "/{produto_id}",
)
def excluir_produto(
    produto_id: int,
    db: Session = Depends(get_db),
):

    produto = ProductService.buscar_produto(
        db,
        produto_id,
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto n├úo encontrado",
        )

    ProductService.excluir_produto(
        db,
        produto,
    )

    return {
        "mensagem": "Produto removido com sucesso"
    }


@router.patch(
    "/{produto_id}/activate",
    response_model=ProductResponse,
)
def ativar_produto(
    produto_id: int,
    db: Session = Depends(get_db),
):

    produto = ProductService.buscar_produto(
        db,
        produto_id,
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto n├úo encontrado",
        )

    return ProductService.ativar_produto(
        db,
        produto,
    )


@router.patch(
    "/{produto_id}/deactivate",
    response_model=ProductResponse,
)
def desativar_produto(
    produto_id: int,
    db: Session = Depends(get_db),
):

    produto = ProductService.buscar_produto(
        db,
        produto_id,
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto n├úo encontrado",
        )

    return ProductService.desativar_produto(
        db,
        produto,
    )


@router.patch(
    "/{produto_id}/stock",
    response_model=ProductResponse,
)
def atualizar_estoque(
    produto_id: int,
    quantidade: int,
    db: Session = Depends(get_db),
):

    produto = ProductService.buscar_produto(
        db,
        produto_id,
    )

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto n├úo encontrado",
        )

    return ProductService.atualizar_estoque(
        db,
        produto,
        quantidade,
    )
