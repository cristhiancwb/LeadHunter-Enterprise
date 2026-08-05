from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Float,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class LeadScore(Base):

    __tablename__ = "lead_scores"


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


    # ==========================
    # ANALISE DE PRESENÇA DIGITAL
    # ==========================


    website_score = Column(
        Float,
        default=0
    )


    instagram_score = Column(
        Float,
        default=0
    )


    google_score = Column(
        Float,
        default=0
    )


    seo_score = Column(
        Float,
        default=0
    )


    marketing_score = Column(
        Float,
        default=0
    )


    social_score = Column(
        Float,
        default=0
    )


    # ==========================
    # INDICADORES PRINCIPAIS
    # ==========================


    overall_score = Column(
        Float,
        default=0
    )


    opportunity_score = Column(
        Float,
        default=0
    )


    # ==========================
    # CONTROLE
    # ==========================


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


    # ==========================
    # RELACIONAMENTO
    # ==========================


    lead = relationship(
        "Lead",
        back_populates="intelligence_score"
    )