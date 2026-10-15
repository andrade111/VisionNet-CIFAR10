"""
Unit tests for data transformations and pre-processing pipeline.
"""

import sys
from pathlib import Path
import pytest
import torch
from PIL import Image

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.core.transforms import get_inference_transforms, denormalize_tensor


def test_inference_transforms_shape_and_range():
    """Verify arbitrary sized image is resized to 32x32 and normalized."""
    transform = get_inference_transforms()

    # Create random 128x80 RGB image
    img = Image.new("RGB", (128, 80), color=(120, 200, 50))
    tensor = transform(img)

    assert tensor.shape == (3, 32, 32)
    # With Normalize((0.5, ...), (0.5, ...)), values should be within [-1.0, 1.0]
    assert tensor.min() >= -1.01
    assert tensor.max() <= 1.01


def test_denormalize_tensor():
    """Verify reversing normalization brings values back to [0, 1]."""
    norm_tensor = torch.tensor([-1.0, 0.0, 1.0]).view(3, 1, 1)
    denorm = denormalize_tensor(norm_tensor)

    assert pytest.approx(denorm[0].item(), 0.01) == 0.0
    assert pytest.approx(denorm[1].item(), 0.01) == 0.5
    assert pytest.approx(denorm[2].item(), 0.01) == 1.0
