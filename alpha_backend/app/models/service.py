from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.sql import func
import enum
from app.db.session import Base

class ServiceCategory(enum.Enum):
    outdoor = "outdoor"
    design = "design"
    creative = "creative"
    marketing = "marketing"
    events = "events"
    additional = "additional"

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(Enum(ServiceCategory), nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
