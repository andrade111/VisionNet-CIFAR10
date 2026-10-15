"""
Helper script to initialize and export baseline VisionNet weights.
Ensures the weights file exists for immediate API testing without waiting for full training.
"""

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

import torch
import torch.nn as nn
from app.config import settings
from app.core.model import VisionNet
from app.utils.logger import get_logger

logger = get_logger("VisionNet.WeightsInit")


def initialize_weights(m):
    """Kaiming normal initialization for conv and linear layers."""
    if isinstance(m, nn.Conv2d):
        nn.init.kaiming_normal_(m.weight, mode="fan_out", nonlinearity="relu")
        if m.bias is not None:
            nn.init.constant_(m.bias, 0)
    elif isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight, mode="fan_out", nonlinearity="relu")
        nn.init.constant_(m.bias, 0)


def generate_baseline_weights(output_path: Path = settings.MODEL_WEIGHTS_PATH):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    model = VisionNet(
        in_channels=settings.INPUT_CHANNELS,
        num_classes=settings.NUM_CLASSES,
    )
    model.apply(initialize_weights)

    torch.save(model.state_dict(), output_path)
    logger.info(f"Initialized baseline weights successfully saved to: {output_path}")


if __name__ == "__main__":
    generate_baseline_weights()
