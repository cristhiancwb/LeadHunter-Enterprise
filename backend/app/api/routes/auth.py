from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.models.user import User
from app.core.security import (
    verificar_senha,
    criar_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class LoginRequest(BaseModel):
    email: str
    senha: str


@router.post("/login")
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db)
):

    usuario = db.query(User).filter(
        User.email == dados.email
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Usuário inválido"
        )

    if not verificar_senha(
        dados.senha,
        usuario.senha
    ):
        raise HTTPException(
            status_code=401,
            detail="Senha inválida"
        )

    token = criar_token({
            "sub": usuario.email,
            "user_id": usuario.id
        , "role": usuario.role})

    return {
        "access_token": token,
        "token_type": "bearer"
    }




