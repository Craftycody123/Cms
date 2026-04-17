from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PortfolioBase(BaseModel):
    title: str
    category: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    client_placeholder: Optional[str] = None
    is_published: bool = True

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    client_placeholder: Optional[str] = None
    is_published: Optional[bool] = None

class PortfolioResponse(PortfolioBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
