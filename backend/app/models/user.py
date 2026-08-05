from sqlalchemy import Column, Integer, String
from app.db.database import Base


class User(Base):

    __tablename__ = "users"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    nome = Column(
        String(100),
        nullable=False
    )


    email = Column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )


    senha = Column(
        String(255),
        nullable=False
    )