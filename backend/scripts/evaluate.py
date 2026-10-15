"""
Standalone CLI script to evaluate a trained VisionNet model on CIFAR-10 test set.
Usage:
    python scripts/evaluate.py --weights weights/visionnet_cifar10.pth
"""

import argparse
import sys
from pathlib import Path

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

import torch
from app.config import settings
from app.core.device import get_device
from app.core.model import VisionNet
from app.services.trainer import VisionNetTrainer
from app.utils.logger import get_logger

logger = get_logger("VisionNet.EvalCLI")


def parse_args():
    parser = argparse.ArgumentParser(description="Evaluate VisionNet model on CIFAR-10 test set.")
    parser.add_argument(
        "--weights",
        type=str,
        default=str(settings.MODEL_WEIGHTS_PATH),
        help=f"Path to PyTorch weights file (default: {settings.MODEL_WEIGHTS_PATH})",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=settings.DEFAULT_BATCH_SIZE,
        help=f"Evaluation batch size (default: {settings.DEFAULT_BATCH_SIZE})",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    weights_path = Path(args.weights)

    if not weights_path.exists():
        logger.error(f"Weights file not found at: {weights_path}")
        sys.exit(1)

    device = get_device()
    logger.info("=" * 60)
    logger.info("VisionNet-CIFAR10 Evaluation Pipeline")
    logger.info("=" * 60)
    logger.info(f"Loading weights from: {weights_path}")
    logger.info(f"Device: {device}")

    trainer = VisionNetTrainer(
        data_dir=settings.DATA_DIR,
        device=device,
    )

    state_dict = torch.load(weights_path, map_location=device, weights_only=True)
    trainer.model.load_state_dict(state_dict)

    _, test_loader = trainer.prepare_dataloaders(batch_size=args.batch_size)
    metrics = trainer.evaluate(test_loader, detailed=True)

    logger.info("-" * 60)
    logger.info(f"Overall Test Accuracy: {metrics['overall_accuracy']:.2f}%")
    logger.info(f"Total Test Samples   : {metrics['total_samples']}")
    logger.info(f"Correct Predictions  : {metrics['correct_samples']}")
    logger.info("-" * 60)
    logger.info("Per-Class Accuracy Breakdown:")
    for class_name, data in metrics["per_class_accuracy"].items():
        logger.info(
            f"  {class_name:<12}: {data['accuracy']:>6.2f}% "
            f"({data['correct']}/{data['total']})"
        )
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
