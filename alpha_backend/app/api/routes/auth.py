from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password, create_access_token, get_current_user
from app.core.rate_limiter import check_rate_limit
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login endpoint. Rate limited to 5 requests per minute.
    The 'username' field should contain the admin email address.
    """
    # Apply rate limiting (5 attempts per minute per IP)
    await check_rate_limit(request)
    
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
