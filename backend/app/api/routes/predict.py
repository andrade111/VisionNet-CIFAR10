"""
Image prediction and classification routes.
Handles single and batch image uploads via multipart/form-data.
"""

from typing import List
from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    Query,
    HTTPException,
    status,
)
from app.config import settings
from app.schemas.prediction import PredictionResponse, BatchPredictionResponse
from app.services.predictor import VisionNetPredictor, get_predictor
from app.utils.image_ops import validate_image_file, load_image_from_bytes
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Inference"])


@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Classify a single image with VisionNet",
    description=(
        "Upload an image (JPEG, PNG, WebP, BMP). The image is automatically preprocessed, "
        "resized to 32x32, normalized to [-1, 1], and evaluated with the VisionNet CNN model."
    ),
)
async def predict_image(
    file: UploadFile = File(..., description="Image file to classify"),
    top_k: int = Query(
        settings.DEFAULT_TOP_K,
        ge=1,
        le=settings.NUM_CLASSES,
        description="Number of top class probabilities to return",
    ),
    predictor: VisionNetPredictor = Depends(get_predictor),
) -> PredictionResponse:
    """
    Classify a single uploaded image and return predicted class with confidence.
    """
    content = await file.read()
    validate_image_file(file.content_type, len(content))

    image_rgb, original_size = load_image_from_bytes(content)

    logger.info(
        f"Processing image upload '{file.filename}' (size: {len(content)} bytes, "
        f"resolution: {original_size[0]}x{original_size[1]})"
    )

    response = predictor.predict(
        image=image_rgb,
        original_size=original_size,
        filename=file.filename,
        top_k=top_k,
    )

    logger.info(
        f"Prediction for '{file.filename}': {response.prediction.predicted_label} "
        f"({response.prediction.confidence_percentage:.2f}%) in {response.inference_time_ms}ms"
    )

    return response


@router.post(
    "/predict/batch",
    response_model=BatchPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Classify multiple images concurrently in batch",
    description="Upload multiple images to run vectorized batch inference through VisionNet.",
)
async def predict_batch(
    files: List[UploadFile] = File(..., description="List of image files to classify"),
    top_k: int = Query(
        settings.DEFAULT_TOP_K,
        ge=1,
        le=settings.NUM_CLASSES,
        description="Number of top class probabilities to return per image",
    ),
    predictor: VisionNetPredictor = Depends(get_predictor),
) -> BatchPredictionResponse:
    """
    Classify multiple uploaded images using vectorized GPU/CPU batch inference.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one image file must be provided.",
        )

    if len(files) > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch limit is 50 images per request.",
        )

    images_data = []
    for file in files:
        content = await file.read()
        validate_image_file(file.content_type, len(content))
        image_rgb, original_size = load_image_from_bytes(content)
        images_data.append((image_rgb, original_size, file.filename))

    logger.info(f"Processing batch of {len(images_data)} images")
    batch_response = predictor.predict_batch(images_data=images_data, top_k=top_k)
    return batch_response
