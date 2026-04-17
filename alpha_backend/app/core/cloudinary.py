import cloudinary
import cloudinary.uploader
from fastapi import HTTPException
from app.core.config import settings

# Configure cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

def upload_image(file):
    """
    Upload an image to Cloudinary.
    
    Args:
        file: A file-like object to upload
        
    Returns:
        str: The secure_url from Cloudinary
        
    Raises:
        HTTPException: 500 error if upload fails
    """
    try:
        result = cloudinary.uploader.upload(file)
        return result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
