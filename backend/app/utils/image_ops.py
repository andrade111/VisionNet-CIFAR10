"""
Image processing and validation utilities.
Handles reading raw bytes, MIME type validation, and Pillow to RGB conversions.
"""

import io
from typing import Tuple
from PIL import Image, UnidentifiedImageError
from fastapi import HTTPException, status
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def validate_image_file(content_type: str | None, file_size: int) -> None:
    """
    Validate uploaded image MIME type and file size.
    Raises HTTPException 400 or 413 if invalid.
    """
    if file_size > settings.MAX_IMAGE_SIZE_BYTES:
        max_mb = settings.MAX_IMAGE_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds maximum allowed size of {max_mb:.1f} MB.",
        )

    if content_type and content_type.lower() not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported media type '{content_type}'. "
                f"Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
            ),
        )


def load_image_from_bytes(data: bytes) -> Tuple[Image.Image, Tuple[int, int]]:
    """
    Safely decode raw bytes into a PIL RGB Image.

    Returns:
        Tuple of (PIL.Image in RGB mode, original (width, height)).
    """
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty image data provided.",
        )

    try:
        image = Image.open(io.BytesIO(data))
        original_size = (image.width, image.height)
        # Ensure conversion to standard RGB (handles grayscale, RGBA, CMYK)
        image_rgb = image.convert("RGB")
        return image_rgb, original_size
    except UnidentifiedImageError as err:
        logger.error(f"Cannot decode image: {err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is not a valid or readable image.",
        )
    except Exception as err:
        logger.error(f"Unexpected image decoding error: {err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process image: {str(err)}",
        )
