"""
VisionNet-CIFAR10 Backend Application Entrypoint.
Production-grade FastAPI application serving deep learning computer vision inference.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.config import settings
from app.services.predictor import get_predictor
from app.utils.logger import get_logger

logger = get_logger("VisionNet.API")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler for startup and shutdown routines."""
    logger.info("=" * 60)
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info("Initializing VisionNet Deep Learning Engine...")

    # Warm-up model on startup
    predictor = get_predictor()
    logger.info(f"Active Device: {predictor.device}")
    logger.info(f"Model Weights Loaded: {predictor.weights_loaded}")
    logger.info("System initialized and ready to receive inference traffic.")
    logger.info("=" * 60)

    yield

    logger.info(f"Shutting down {settings.PROJECT_NAME}. Cleaning up resources.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Cross-Origin Resource Sharing (CORS) Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Fallback handler to ensure uniform JSON responses on unhandled exceptions."""
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred during processing.",
        },
    )


# Register main API router with version prefix
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    """Welcome and API documentation link."""
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "health_check": f"{settings.API_V1_PREFIX}/health",
        "model_info": f"{settings.API_V1_PREFIX}/model/info",
        "predict_endpoint": f"{settings.API_V1_PREFIX}/predict",
    }
