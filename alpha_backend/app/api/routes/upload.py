from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.service import Service
from app.models.portfolio import Portfolio
from app.core.security import get_current_user
from app.core.cloudinary import upload_image

router = APIRouter()

def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require admin privileges."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin")
    return current_user

@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    image_type: str = Query(..., description="Type of image: 'service' or 'portfolio'"),
    item_id: int | None = Query(None, description="ID of service or portfolio to update (optional)"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Upload an image to Cloudinary (admin only).
    
    Args:
        file: The image file to upload
        image_type: Either "service" or "portfolio"
        item_id: Optional ID of the service/portfolio to update
        current_user: The authenticated user (must be admin)
        db: Database session
        
    Returns:
        dict: { "image_url": "<cloudinary secure_url>", "item_id": <id>, "type": "<type>" }
    """
    if image_type not in ["service", "portfolio"]:
        raise HTTPException(status_code=400, detail="image_type must be 'service' or 'portfolio'")
    
    # Upload to Cloudinary
    image_url = upload_image(file.file)
    
    # Update service or portfolio if item_id is provided
    if item_id:
        if image_type == "service":
            service = db.query(Service).filter(Service.id == item_id).first()
            if not service:
                raise HTTPException(status_code=404, detail="Service not found")
            service.icon_url = image_url
            db.commit()
        elif image_type == "portfolio":
            portfolio = db.query(Portfolio).filter(Portfolio.id == item_id).first()
            if not portfolio:
                raise HTTPException(status_code=404, detail="Portfolio not found")
            portfolio.image_url = image_url
            db.commit()
    
    return {
        "image_url": image_url,
        "item_id": item_id,
        "type": image_type
    }
