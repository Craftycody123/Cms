from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.site_setting import SiteSetting
from app.models.user import User
from app.schemas.site_setting import SiteSettingResponse, SiteSettingUpdate
from app.core.security import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

@router.get("/")
def get_settings(db: Session = Depends(get_db)):
    settings_list = db.query(SiteSetting).all()
    return {s.key: s.value for s in settings_list}

@router.put("/{key}", response_model=SiteSettingResponse, dependencies=[Depends(require_admin)])
def update_setting(key: str, setting_in: SiteSettingUpdate, db: Session = Depends(get_db)):
    db_setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not db_setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    if setting_in.value is not None:
        db_setting.value = setting_in.value
    db.commit()
    db.refresh(db_setting)
    return db_setting
