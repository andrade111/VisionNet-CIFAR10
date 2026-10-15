"""
Health check and readiness route.
"""

import time
from fastapi import APIRouter, Depends
from app.config import settings
from app.core.device import get_device_info
from app.schemas.health import HealthResponse
from app.services.predictor import VisionNetPredictor, get_predictor

router = APIRouter(tags=["System Health"])

APP_START_TIME = time.time()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check service health and model readiness",
    description="Returns API status, uptime, hardware acceleration backend, and model weights status.",
)
async def check_health(
    predictor: VisionNetPredictor = Depends(get_predictor),
) -> HealthResponse:
    """Return runtime system health and model availability."""
    uptime = round(time.time() - APP_START_TIME, 2)
    device_info = get_device_info()

    return HealthResponse(
        status="healthy" if predictor.model is not None else "degraded",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        model_loaded=predictor.weights_loaded,
        device=device_info,
        uptime_seconds=uptime,
    )
