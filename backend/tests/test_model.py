"""
Unit tests for VisionNet neural network architecture.
"""

import sys
from pathlib import Path
import pytest
import torch

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.core.model import VisionNet


def test_visionnet_initialization():
    """Verify default layer setup and parameter counts."""
    model = VisionNet(in_channels=3, num_classes=10)
    summary = model.get_num_parameters()
    assert summary["total_parameters"] > 0
    assert summary["trainable_parameters"] == summary["total_parameters"]


def test_visionnet_forward_single():
    """Verify output shape and valid logit values for a single 32x32 image."""
    model = VisionNet(in_channels=3, num_classes=10)
    model.eval()

    dummy_input = torch.randn(1, 3, 32, 32)
    with torch.no_grad():
        output = model(dummy_input)

    assert output.shape == (1, 10)
    assert not torch.isnan(output).any()


def test_visionnet_forward_batch():
    """Verify batched inference with arbitrary batch size."""
    model = VisionNet(in_channels=3, num_classes=10)
    model.eval()

    batch_size = 8
    dummy_batch = torch.randn(batch_size, 3, 32, 32)
    with torch.no_grad():
        output = model(dummy_batch)

    assert output.shape == (batch_size, 10)
