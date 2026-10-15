"""
Model metadata and management routes.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.config import settings
from app.schemas.health import ModelInfoResponse
from app.services.predictor import VisionNetPredictor, get_predictor

router = APIRouter(prefix="/model", tags=["Model Information"])


@router.get(
    "/info",
    response_model=ModelInfoResponse,
    summary="Get VisionNet model architecture and weights metadata",
)
async def get_model_info(
    predictor: VisionNetPredictor = Depends(get_predictor),
) -> ModelInfoResponse:
    """Return comprehensive architectural summary and parameter statistics."""
    return predictor.get_info()


@router.get(
    "/classes",
    summary="List all CIFAR-10 classification categories",
    description="Returns canonical indices, English labels, and Portuguese translations for all 10 classes.",
)
async def get_model_classes() -> Dict[str, Any]:
    """Return all target categories with localized display names."""
    return {
        "num_classes": settings.NUM_CLASSES,
        "classes": list(settings.CLASSES),
        "metadata": settings.CLASS_METADATA,
    }


@router.post(
    "/reload",
    summary="Reload model weights from disk",
    description="Allows dynamic reloading of weights after running a new training run.",
)
async def reload_model_weights(
    predictor: VisionNetPredictor = Depends(get_predictor),
) -> Dict[str, Any]:
    """Force reload of the PyTorch weights."""
    loaded = predictor.reload_weights()
    if not loaded:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Could not load valid weights from {predictor.weights_path}",
        )
    return {
        "success": True,
        "message": f"Successfully reloaded weights from {predictor.weights_path}",
        "device": str(predictor.device),
    }
