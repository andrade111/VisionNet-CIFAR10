"""
Pydantic schemas for prediction requests and responses.
"""

from typing import List, Dict, Optional, Tuple
from pydantic import BaseModel, Field


class ClassProbability(BaseModel):
    """Detailed probability distribution for an individual class."""
    class_index: int = Field(..., description="Index of the class in CIFAR-10 (0-9)")
    label: str = Field(..., description="Standard label identifier (e.g., 'airplane')")
    display_name: str = Field(..., description="English display name")
    display_pt: str = Field(..., description="Portuguese display name")
    probability: float = Field(..., description="Normalized softmax probability [0.0, 1.0]")
    confidence_percentage: float = Field(..., description="Confidence as percentage (0-100%)")


class PredictionResult(BaseModel):
    """Core prediction output from VisionNet classifier."""
    predicted_class_index: int = Field(..., description="Top predicted class index")
    predicted_label: str = Field(..., description="Top predicted class canonical label")
    display_name: str = Field(..., description="Top predicted class English name")
    display_pt: str = Field(..., description="Top predicted class Portuguese name")
    confidence: float = Field(..., description="Confidence score [0.0, 1.0]")
    confidence_percentage: float = Field(..., description="Confidence score formatted as percentage")
    top_k: List[ClassProbability] = Field(..., description="Top-K class rankings")
    all_probabilities: Dict[str, float] = Field(..., description="Full 10-class probability distribution")


class PredictionResponse(BaseModel):
    """Standard API response for a single image prediction."""
    success: bool = Field(True, description="Execution status")
    filename: Optional[str] = Field(None, description="Original uploaded filename")
    inference_time_ms: float = Field(..., description="Pure model forward pass latency in milliseconds")
    total_time_ms: float = Field(..., description="Total request latency including preprocessing in milliseconds")
    device: str = Field(..., description="Compute device utilized for inference (cuda/mps/cpu)")
    original_image_size: Tuple[int, int] = Field(..., description="Original dimensions (width, height)")
    transformed_image_size: Tuple[int, int] = Field((32, 32), description="Preprocessed input resolution")
    prediction: PredictionResult = Field(..., description="Classification findings")


class BatchPredictionResponse(BaseModel):
    """Standard API response for batch image predictions."""
    success: bool = Field(True, description="Execution status")
    total_images: int = Field(..., description="Count of successfully processed images")
    batch_time_ms: float = Field(..., description="Total batch inference latency in milliseconds")
    device: str = Field(..., description="Compute device utilized for inference")
    results: List[PredictionResponse] = Field(..., description="Predictions for each image in batch")
