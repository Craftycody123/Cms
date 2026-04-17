from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.team import Team
from app.models.user import User
from app.schemas.team import TeamResponse, TeamCreate, TeamUpdate
from app.core.security import get_current_user

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

@router.get("/", response_model=List[TeamResponse])
def get_teams(db: Session = Depends(get_db)):
    return db.query(Team).all()

@router.post("/", response_model=TeamResponse, dependencies=[Depends(require_admin)])
def create_team(team_in: TeamCreate, db: Session = Depends(get_db)):
    db_team = Team(**team_in.model_dump())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.put("/{member_id}", response_model=TeamResponse, dependencies=[Depends(require_admin)])
def update_team(member_id: int, team_in: TeamUpdate, db: Session = Depends(get_db)):
    db_team = db.query(Team).filter(Team.id == member_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Team member not found")
    update_data = team_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_team, field, value)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.delete("/{member_id}", dependencies=[Depends(require_admin)])
def delete_team(member_id: int, db: Session = Depends(get_db)):
    db_team = db.query(Team).filter(Team.id == member_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(db_team)
    db.commit()
    return {"ok": True}
