from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.portfolio import PortfolioResponse, PortfolioCreate, PortfolioUpdate
from app.core.security import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

@router.get("/", response_model=List[PortfolioResponse])
def get_portfolios(db: Session = Depends(get_db)):
    return db.query(Portfolio).filter(Portfolio.is_published == True).all()

@router.get("/{item_id}", response_model=PortfolioResponse)
def get_portfolio(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Portfolio).filter(Portfolio.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return item

@router.post("/", response_model=PortfolioResponse, dependencies=[Depends(require_admin)])
def create_portfolio(item_in: PortfolioCreate, db: Session = Depends(get_db)):
    db_item = Portfolio(**item_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=PortfolioResponse, dependencies=[Depends(require_admin)])
def update_portfolio(item_id: int, item_in: PortfolioUpdate, db: Session = Depends(get_db)):
    db_item = db.query(Portfolio).filter(Portfolio.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", dependencies=[Depends(require_admin)])
def delete_portfolio(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Portfolio).filter(Portfolio.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}
