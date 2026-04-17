from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TeamBase(BaseModel):
    name: str
    role: str
    photo_url: Optional[str] = None
    bio: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    photo_url: Optional[str] = None
    bio: Optional[str] = None

class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
