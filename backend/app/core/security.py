from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt


SECRET_KEY = "LEADHUNTER_SECRET_2026"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def criar_hash_senha(senha: str):

    senha = senha[:72]

    return pwd_context.hash(senha)



def verificar_senha(
    senha,
    senha_hash
):

    senha = senha[:72]

    return pwd_context.verify(
        senha,
        senha_hash
    )



def criar_token(
    dados: dict
):

    payload = dados.copy()

    expiracao = datetime.utcnow() + timedelta(
        minutes=TOKEN_EXPIRE_MINUTES
    )

    payload["exp"] = expiracao


    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token