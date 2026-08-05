from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import criar_hash_senha


def criar_usuario(
    db:Session,
    nome,
    email,
    senha
):

    usuario = User(
        nome=nome,
        email=email,
        senha=criar_hash_senha(senha)
    )


    db.add(usuario)

    db.commit()

    db.refresh(usuario)


    return usuario