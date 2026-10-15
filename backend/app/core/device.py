"""
Hardware device management and discovery module.
Detects CUDA (NVIDIA), MPS (Apple Silicon), or CPU acceleration.
"""

import torch
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def get_device(force_cpu: bool = False) -> torch.device:
    """
    Select and return the most performant compute device available.

    Args:
        force_cpu: If True, forces execution on CPU regardless of GPU availability.

    Returns:
        torch.device configured for the optimal hardware backend.
    """
    if force_cpu:
        logger.info("Device selection forced to CPU by parameter.")
        return torch.device("cpu")

    if settings.DEVICE_OVERRIDE:
        override = settings.DEVICE_OVERRIDE.lower().strip()
        try:
            device = torch.device(override)
            logger.info(f"Using explicitly configured device override: {device}")
            return device
        except Exception as exc:
            logger.warning(
                f"Invalid DEVICE_OVERRIDE '{settings.DEVICE_OVERRIDE}': {exc}. "
                "Falling back to automated hardware detection."
            )

    # 1. NVIDIA CUDA GPU
    if torch.cuda.is_available():
        device_name = torch.cuda.get_device_name(0)
        device_count = torch.cuda.device_count()
        logger.info(
            f"Hardware acceleration detected: NVIDIA CUDA ({device_count} device(s) found). "
            f"Active: {device_name}"
        )
        return torch.device("cuda")

    # 2. Apple Silicon Metal Performance Shaders (MPS)
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        logger.info("Hardware acceleration detected: Apple Silicon MPS (Metal Performance Shaders).")
        return torch.device("mps")

    # 3. CPU Fallback
    logger.info("No dedicated GPU acceleration detected. Running on CPU.")
    return torch.device("cpu")


def get_device_info() -> dict:
    """Return runtime hardware metadata for diagnostics and observability."""
    device = get_device()
    info = {
        "device_type": device.type,
        "cuda_available": torch.cuda.is_available(),
        "mps_available": hasattr(torch.backends, "mps") and torch.backends.mps.is_available(),
        "device_name": "CPU",
        "cuda_version": torch.version.cuda if torch.cuda.is_available() else None,
    }

    if device.type == "cuda":
        info["device_name"] = torch.cuda.get_device_name(0)
        info["device_count"] = torch.cuda.device_count()
        info["memory_allocated_mb"] = round(torch.cuda.memory_allocated(0) / (1024**2), 2)
        info["memory_cached_mb"] = round(torch.cuda.memory_reserved(0) / (1024**2), 2)
    elif device.type == "mps":
        info["device_name"] = "Apple Silicon GPU (MPS)"

    return info
