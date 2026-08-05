from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base



class LeadProfile(Base):

    __tablename__ = "lead_profiles"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    lead_id = Column(
        Integer,
        ForeignKey("leads.id"),
        nullable=False,
        unique=True
    )


    website = Column(
        String(255),
        nullable=True
    )


    instagram = Column(
        String(255),
        nullable=True
    )


    facebook = Column(
        String(255),
        nullable=True
    )


    linkedin = Column(
        String(255),
        nullable=True
    )


    youtube = Column(
        String(255),
        nullable=True
    )


    tiktok = Column(
        String(255),
        nullable=True
    )


    whatsapp = Column(
        String(50),
        nullable=True
    )


    email_principal = Column(
        String(255),
        nullable=True
    )


    rating = Column(
        Float,
        nullable=True
    )


    reviews = Column(
        Integer,
        default=0
    )


    photos = Column(
        Integer,
        default=0
    )


    latitude = Column(
        Float,
        nullable=True
    )


    longitude = Column(
        Float,
        nullable=True
    )


    place_id = Column(
        String(255),
        nullable=True
    )


    google_url = Column(
        String(500),
        nullable=True
    )


    opening_hours = Column(
        Text,
        nullable=True
    )


    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


    # =============================
    # RELACIONAMENTO
    # =============================

    lead = relationship(
        "Lead",
        back_populates="profile"
    )