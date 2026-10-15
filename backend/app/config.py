"""
Configuration settings for VisionNet-CIFAR10.
Manages environment variables, model paths, and runtime hyperparameters.
"""

from pathlib import Path
from typing import List, Tuple
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Application configuration and hyperparameter settings."""

    # Project Information
    PROJECT_NAME: str = "VisionNet-CIFAR10"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "Enterprise-ready Computer Vision REST API for real-time image "
        "classification on the CIFAR-10 dataset using PyTorch and FastAPI."
    )
    API_V1_PREFIX: str = "/api/v1"

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # Model & Storage Paths
    WEIGHTS_DIR: Path = BASE_DIR / "weights"
    DATA_DIR: Path = BASE_DIR / "data"
    MODEL_WEIGHTS_PATH: Path = BASE_DIR / "weights" / "visionnet_cifar10.pth"

    # Model Architecture Parameters
    IMAGE_SIZE: Tuple[int, int] = (32, 32)
    INPUT_CHANNELS: int = 3
    NUM_CLASSES: int = 10

    # Dataset Classes (Standard CIFAR-10 labels and canonical names)
    CLASSES: Tuple[str, ...] = (
        "airplane",
        "automobile",
        "bird",
        "cat",
        "deer",
        "dog",
        "frog",
        "horse",
        "ship",
        "truck",
    )

    # Class mappings with human-readable aliases and Portuguese descriptions
    CLASS_METADATA: dict = {
        0: {"label": "airplane", "display_name": "Airplane", "display_pt": "Avião"},
        1: {"label": "automobile", "display_name": "Automobile", "display_pt": "Automóvel"},
        2: {"label": "bird", "display_name": "Bird", "display_pt": "Pássaro"},
        3: {"label": "cat", "display_name": "Cat", "display_pt": "Gato"},
        4: {"label": "deer", "display_name": "Deer", "display_pt": "Cervo"},
        5: {"label": "dog", "display_name": "Dog", "display_pt": "Cachorro"},
        6: {"label": "frog", "display_name": "Frog", "display_pt": "Sapo"},
        7: {"label": "horse", "display_name": "Horse", "display_pt": "Cavalo"},
        8: {"label": "ship", "display_name": "Ship", "display_pt": "Navio"},
        9: {"label": "truck", "display_name": "Truck", "display_pt": "Caminhão"},
    }

    # Normalization Hyperparameters (matches CIFAR-10 canonical normalization)
    NORM_MEAN: Tuple[float, float, float] = (0.5, 0.5, 0.5)
    NORM_STD: Tuple[float, float, float] = (0.5, 0.5, 0.5)

    # Inference Configuration
    DEFAULT_TOP_K: int = 5
    DEVICE_OVERRIDE: str = ""  # "cuda", "mps", "cpu", or empty for auto-detect

    # Training Default Hyperparameters
    DEFAULT_BATCH_SIZE: int = 64
    DEFAULT_EPOCHS: int = 10
    DEFAULT_LEARNING_RATE: float = 0.001

    # Allowed MIME Types for image upload
    ALLOWED_IMAGE_TYPES: List[str] = Field(
        default=["image/jpeg", "image/png", "image/webp", "image/bmp"]
    )
    MAX_IMAGE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
