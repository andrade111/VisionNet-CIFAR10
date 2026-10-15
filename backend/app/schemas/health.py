"""
Pydantic schemas for health check and model metadata inspection.
"""

from typing import List, Dict, Any
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health check status response."""
    status: str = Field(..., description="System operational status (healthy/degraded)")
    project: str = Field(..., description="Project name")
    version: str = Field(..., description="API version")
    model_loaded: bool = Field(..., description="Whether PyTorch model weights are active")
    device: Dict[str, Any] = Field(..., description="Hardware device runtime information")
    uptime_seconds: float = Field(..., description="Application server uptime in seconds")


class ModelInfoResponse(BaseModel):
    """Detailed metadata and structural architecture of the deployed VisionNet model."""
    model_name: str = Field("VisionNet", description="Neural network identifier")
    framework: str = Field("PyTorch", description="Underlying deep learning framework")
    version: str = Field("1.0.0", description="Model version")
    dataset: str = Field("CIFAR-10", description="Target classification dataset")
    num_classes: int = Field(10, description="Total target categories")
    classes: List[str] = Field(..., description="Canonical category labels")
    class_metadata: Dict[int, Dict[str, str]] = Field(..., description="Multi-language names")
    input_resolution: List[int] = Field([32, 32], description="Spatial input resolution [H, W]")
    input_channels: int = Field(3, description="Color channels (RGB)")
    weights_path: str = Field(..., description="Active weights filesystem path")
    weights_loaded: bool = Field(..., description="Weights availability status")
    total_parameters: int = Field(..., description="Total network parameter count")
    trainable_parameters: int = Field(..., description="Trainable parameter count")
    device: str = Field(..., description="Current compute device")
    architecture: Dict[str, Any] = Field(..., description="Layer specifications and parameters")
