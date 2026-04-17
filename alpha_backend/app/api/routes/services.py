from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.service import Service
from app.models.user import User
from app.schemas.service import ServiceResponse, ServiceCreate, ServiceUpdate
from app.core.security import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

@router.get("/", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).filter(Service.is_active == True).all()

@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/", response_model=ServiceResponse, status_code=201, dependencies=[Depends(require_admin)])
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(**service_in.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.put("/{service_id}", response_model=ServiceResponse, dependencies=[Depends(require_admin)])
def update_service(service_id: int, service_in: ServiceUpdate, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    update_data = service_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_service, field, value)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}", dependencies=[Depends(require_admin)])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(db_service)
    db.commit()
    return {"ok": True}
