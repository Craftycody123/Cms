import time
from fastapi import Request, HTTPException, status

# In-memory rate limit storage
# Format: { ip_address: { count: int, window_start: float } }
_rate_limit_storage = {}

# Constants
RATE_LIMIT_REQUESTS = 5
RATE_LIMIT_WINDOW_SECONDS = 60


async def check_rate_limit(request: Request) -> None:
    """
    Check if the request exceeds the rate limit for login attempts.
    
    Allows maximum 5 requests per minute per IP address.
    Raises HTTPException with 429 status if limit exceeded.
    
    Args:
        request: FastAPI Request object
        
    Raises:
        HTTPException: 429 Too Many Requests if rate limit exceeded
    """
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    # Initialize or get existing entry
    if client_ip not in _rate_limit_storage:
        _rate_limit_storage[client_ip] = {
            "count": 1,
            "window_start": current_time
        }
        return
    
    entry = _rate_limit_storage[client_ip]
    time_elapsed = current_time - entry["window_start"]
    
    # Reset counter if window has expired
    if time_elapsed > RATE_LIMIT_WINDOW_SECONDS:
        _rate_limit_storage[client_ip] = {
            "count": 1,
            "window_start": current_time
        }
        return
    
    # Check if limit exceeded
    if entry["count"] >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again in a minute."
        )
    
    # Increment counter
    entry["count"] += 1
