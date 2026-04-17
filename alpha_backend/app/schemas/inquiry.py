from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class InquiryBase(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    service_interested: Optional[str] = None
    message: str

class InquiryCreate(InquiryBase):
    pass

class InquiryUpdate(BaseModel):
    is_read: bool

class InquiryResponse(InquiryBase):
    id: int
    is_read: bool
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)
