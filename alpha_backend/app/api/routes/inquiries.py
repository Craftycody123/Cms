from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.inquiry import Inquiry
from app.models.user import User
from app.schemas.inquiry import InquiryResponse, InquiryCreate
from app.core.security import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

from app.models.site_setting import SiteSetting
from app.core.config import settings
import logging
import smtplib
from email.message import EmailMessage
from pydantic import BaseModel

logger = logging.getLogger(__name__)

def send_email_notification(to_email: str, reply_email: str, subject: str, message: str):
    try:
        if not settings.MAIL_SERVER or not settings.MAIL_USERNAME:
            logging.warning("Email configuration missing. Skipping email notification.")
            return

        msg = EmailMessage()
        msg.set_content(f"Inquiry from: {reply_email}\n\n{message}")
        msg["Subject"] = subject
        msg["From"] = settings.MAIL_FROM
        msg["To"] = to_email

        with smtplib.SMTP(settings.MAIL_SERVER, 587) as server:
            server.starttls()
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        logging.warning(f"Failed to send email: {e}")

@router.post("/", response_model=InquiryResponse)
def create_inquiry(inquiry_in: InquiryCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_inq = Inquiry(**inquiry_in.model_dump())
    db.add(db_inq)
    db.commit()
    db.refresh(db_inq)
    
    setting = db.query(SiteSetting).filter(SiteSetting.key == 'contact_email').first()
    to_email = setting.value if setting and setting.value else settings.MAIL_FROM

    background_tasks.add_task(send_email_notification, to_email, inquiry_in.email, "New Inquiry", inquiry_in.message)
    return db_inq

class InquiryListResponse(BaseModel):
    total_count: int
    items: List[InquiryResponse]

@router.get("/", response_model=InquiryListResponse, dependencies=[Depends(require_admin)])
def get_inquiries(
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get inquiries with optional filtering and pagination."""
    query = db.query(Inquiry)
    
    if is_read is not None:
        query = query.filter(Inquiry.is_read == is_read)
    
    total_count = query.count()
    items = query.order_by(Inquiry.submitted_at.desc()).limit(limit).offset(offset).all()
    
    return {"total_count": total_count, "items": items}

class MarkReadRequest(BaseModel):
    is_read: bool

@router.patch("/{inq_id}/read", response_model=InquiryResponse, dependencies=[Depends(require_admin)])
def toggle_inquiry_read(inq_id: int, body: MarkReadRequest, db: Session = Depends(get_db)):
    """Mark inquiry as read or unread."""
    db_inq = db.query(Inquiry).filter(Inquiry.id == inq_id).first()
    if not db_inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db_inq.is_read = body.is_read
    db.commit()
    db.refresh(db_inq)
    return db_inq

@router.delete("/{inq_id}", dependencies=[Depends(require_admin)])
def delete_inquiry(inq_id: int, db: Session = Depends(get_db)):
    db_inq = db.query(Inquiry).filter(Inquiry.id == inq_id).first()
    if not db_inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(db_inq)
    db.commit()
    return {"ok": True}
