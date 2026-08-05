from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer


from app.core.security import verificar_token


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)



def usuario_atual(
    token: str = Depends(oauth2_scheme)
):

    payload = verificar_token(token)


    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        )


    return payload