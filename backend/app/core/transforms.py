"""
Data transformation and pre-processing pipelines.
Standardizes image tensors for training, validation, and real-time inference.
"""

from typing import Tuple
import torch
import torchvision.transforms as transforms
from PIL import Image
from app.config import settings


def get_inference_transforms(image_size: Tuple[int, int] = settings.IMAGE_SIZE) -> transforms.Compose:
    """
    Standard pre-processing pipeline for production inference.
    Resizes arbitrary input images to 32x32, converts to PyTorch tensor,
    and normalizes values to [-1.0, 1.0].
    """
    return transforms.Compose([
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=settings.NORM_MEAN, std=settings.NORM_STD),
    ])


def get_train_transforms(image_size: Tuple[int, int] = settings.IMAGE_SIZE) -> transforms.Compose:
    """
    Pipeline for training data loader.
    """
    return transforms.Compose([
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=settings.NORM_MEAN, std=settings.NORM_STD),
    ])


def get_eval_transforms(image_size: Tuple[int, int] = settings.IMAGE_SIZE) -> transforms.Compose:
    """
    Pipeline for validation and test evaluation.
    """
    return transforms.Compose([
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize(mean=settings.NORM_MEAN, std=settings.NORM_STD),
    ])


def denormalize_tensor(tensor: torch.Tensor) -> torch.Tensor:
    """
    Revert normalization [-1, 1] back to [0, 1] range for visualization/export.
    Formula: img = img * 0.5 + 0.5
    """
    mean = torch.tensor(settings.NORM_MEAN, device=tensor.device).view(-1, 1, 1)
    std = torch.tensor(settings.NORM_STD, device=tensor.device).view(-1, 1, 1)
    return tensor * std + mean
