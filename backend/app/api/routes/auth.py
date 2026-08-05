from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.core.security import (
    verificar_senha,
    criar_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)



@router.post("/login")
def login(
    email:str,
    senha:str,
    db:Session = Depends(get_db)
):

    usuario = db.query(User).filter(
        User.email == email
    ).first()


    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Usuário inválido"
        )


    if not verificar_senha(
        senha,
        usuario.senha
    ):
        raise HTTPException(
            status_code=401,
            detail="Senha inválida"
        )


    token = criar_token(
        {
            "sub": usuario.email,
            "user_id": usuario.id
        }
    )


    return {
        "access_token": token,
        "token_type": "bearer"
    }