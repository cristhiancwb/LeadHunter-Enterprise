from sqlalchemy.orm import Session
from sqlalchemy import asc, desc

from app.models.product import Product
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
)


class ProductService:

    @staticmethod
    def listar_produtos(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        categoria: str | None = None,
        ativo: bool | None = None,
        ordenar: str = "nome",
        ordem: str = "asc",
    ):

        query = db.query(Product)

        if categoria:
            query = query.filter(Product.categoria == categoria)

        if ativo is not None:
            query = query.filter(Product.ativo == ativo)

        # Garante que apenas colunas válidas sejam usadas
        if not hasattr(Product, ordenar):
            ordenar = "nome"

        coluna = getattr(Product, ordenar)

        if ordem.lower() == "desc":
            query = query.order_by(desc(coluna))
        else:
            query = query.order_by(asc(coluna))

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def buscar_produto(
        db: Session,
        produto_id: int,
    ):

        return (
            db.query(Product)
            .filter(Product.id == produto_id)
            .first()
        )

    @staticmethod
    def buscar_por_nome(
        db: Session,
        nome: str,
    ):

        return (
            db.query(Product)
            .filter(Product.nome.ilike(f"%{nome}%"))
            .order_by(Product.nome.asc())
            .all()
        )

    @staticmethod
    def buscar_por_categoria(
        db: Session,
        categoria: str,
    ):

        return (
            db.query(Product)
            .filter(Product.categoria == categoria)
            .order_by(Product.nome.asc())
            .all()
        )

    @staticmethod
    def criar_produto(
        db: Session,
        dados: ProductCreate,
    ):

        produto = Product(**dados.model_dump())

        db.add(produto)
        db.commit()
        db.refresh(produto)

        return produto

    @staticmethod
    def atualizar_produto(
        db: Session,
        produto: Product,
        dados: ProductUpdate,
    ):

        # Atualiza apenas os campos enviados
        dados_atualizados = dados.model_dump(exclude_unset=True)

        for campo, valor in dados_atualizados.items():
            setattr(produto, campo, valor)

        db.commit()
        db.refresh(produto)

        return produto

    @staticmethod
    def excluir_produto(
        db: Session,
        produto: Product,
    ):

        db.delete(produto)
        db.commit()

        return True

    @staticmethod
    def atualizar_estoque(
        db: Session,
        produto: Product,
        quantidade: int,
    ):

        produto.estoque = quantidade

        db.commit()
        db.refresh(produto)

        return produto

    @staticmethod
    def ativar_produto(
        db: Session,
        produto: Product,
    ):

        produto.ativo = True

        db.commit()
        db.refresh(produto)

        return produto

    @staticmethod
    def desativar_produto(
        db: Session,
        produto: Product,
    ):

        produto.ativo = False

        db.commit()
        db.refresh(produto)

        return produto

    @staticmethod
    def contar_produtos(
        db: Session,
    ):

        return db.query(Product).count()

    @staticmethod
    def produtos_ativos(
        db: Session,
    ):

        return (
            db.query(Product)
            .filter(Product.ativo == True)
            .order_by(Product.nome.asc())
            .all()
        )