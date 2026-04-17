from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SiteSettingBase(BaseModel):
    key: str
    value: Optional[str] = None

class SiteSettingCreate(SiteSettingBase):
    pass

class SiteSettingUpdate(BaseModel):
    value: Optional[str] = None

class SiteSettingResponse(SiteSettingBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
