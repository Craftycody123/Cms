from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.service import ServiceCategory

class ServiceBase(BaseModel):
    title: str
    category: ServiceCategory
    description: Optional[str] = None
    icon_url: Optional[str] = None
    is_active: bool = True

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[ServiceCategory] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None
    is_active: Optional[bool] = None

class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
