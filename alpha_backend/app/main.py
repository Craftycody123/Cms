from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.routes import auth, services, portfolio, team, settings as site_settings, inquiries, upload
from app.db.session import SessionLocal
from app.db.init_db import init_db
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    yield

# Create FastAPI app with conditional Swagger docs
if settings.ENVIRONMENT == "production":
    app = FastAPI(title="Alpha API", lifespan=lifespan, docs_url=None, redoc_url=None)
else:
    app = FastAPI(title="Alpha API", lifespan=lifespan)

# Add HTTPS redirect middleware in production
if settings.ENVIRONMENT == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# Add CORS middleware
origins = [origin.strip() for origin in settings.FRONTEND_ORIGIN.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler for unhandled errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if settings.ENVIRONMENT == "production":
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )
    else:
        # In development, return full error details
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc), "type": type(exc).__name__}
        )
BASE_DIR = Path(__file__).resolve().parent.parent.parent

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)

app.mount(
    "/js",
    StaticFiles(directory=BASE_DIR / "alpha_frontend_stich" / "js"),
    name="js"
)

templates = Jinja2Templates(
    directory=BASE_DIR / "alpha_frontend_stich"
)
@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(
        request,
        "index.html",
        {"request": request}
    )


@app.get("/about")
async def about(request: Request):
    return templates.TemplateResponse(
        request,
        "about.html",
        {"request": request}
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/services")
async def services_page(request: Request):
    return templates.TemplateResponse(
        request,
        "services.html",
        {"request": request}
    )


@app.get("/works")
async def works(request: Request):
    return templates.TemplateResponse(
        request,
        "works.html",
        {"request": request}
    )


@app.get("/why")
async def why(request: Request):
    return templates.TemplateResponse(
        request,
        "why.html",
        {"request": request}
    )


@app.get("/contact")
async def contact(request: Request):
    return templates.TemplateResponse(
        request,
        "contact.html",
        {"request": request}
    )


@app.get("/admin")
async def admin(request: Request):
    return templates.TemplateResponse(
        request,
        "admin.html",
        {"request": request}
    )
# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(services.router, prefix="/api/services", tags=["services"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])
app.include_router(team.router, prefix="/api/team", tags=["team"])
app.include_router(site_settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(inquiries.router, prefix="/api/inquiries", tags=["inquiries"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
