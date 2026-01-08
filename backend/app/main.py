from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

from app.config import get_settings
from app.api.v1.router import api_router
from app.database import engine, Base

settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="A Duolingo-style learning platform for Python and Computational Thinking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=True,  # Handle trailing slashes automatically
)

# CORS middleware for frontend communication
# Note: Cannot use allow_origins=["*"] with allow_credentials=True
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


# Global exception handler for debugging
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch all exceptions and return detailed error in debug mode."""
    error_detail = str(exc)
    if settings.debug:
        error_detail = f"{type(exc).__name__}: {str(exc)}\n{traceback.format_exc()}"
    print(f"ERROR: {error_detail}")  # Print to console
    return JSONResponse(
        status_code=500,
        content={"detail": error_detail}
    )


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Welcome to PyLingo API",
        "docs": "/docs",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0"
    }
