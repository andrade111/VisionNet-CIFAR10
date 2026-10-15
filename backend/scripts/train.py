"""
Standalone CLI script to train VisionNet on CIFAR-10.
Usage:
    python scripts/train.py --epochs 10 --batch-size 64 --lr 0.001
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
from app.services.trainer import VisionNetTrainer
from app.utils.logger import get_logger

logger = get_logger("VisionNet.TrainCLI")


def parse_args():
    parser = argparse.ArgumentParser(description="Train VisionNet CNN model on CIFAR-10 dataset.")
    parser.add_argument(
        "--epochs",
        type=int,
        default=settings.DEFAULT_EPOCHS,
        help=f"Number of training epochs (default: {settings.DEFAULT_EPOCHS})",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=settings.DEFAULT_BATCH_SIZE,
        help=f"Batch size for training and evaluation (default: {settings.DEFAULT_BATCH_SIZE})",
    )
    parser.add_argument(
        "--lr",
        type=float,
        default=settings.DEFAULT_LEARNING_RATE,
        help=f"Adam optimizer learning rate (default: {settings.DEFAULT_LEARNING_RATE})",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=str(settings.MODEL_WEIGHTS_PATH),
        help=f"Path to save trained PyTorch weights (default: {settings.MODEL_WEIGHTS_PATH})",
    )
    parser.add_argument(
        "--device",
        type=str,
        default="",
        help="Device to use: 'cuda', 'mps', 'cpu', or leave empty for auto-detection.",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    if args.device:
        device = torch.device(args.device)
    else:
        device = get_device()

    logger.info("=" * 60)
    logger.info("VisionNet-CIFAR10 Training Pipeline")
    logger.info("=" * 60)
    logger.info(f"Compute Device : {device}")
    logger.info(f"Target Epochs  : {args.epochs}")
    logger.info(f"Batch Size     : {args.batch_size}")
    logger.info(f"Learning Rate  : {args.lr}")
    logger.info(f"Output Weights : {args.output}")

    trainer = VisionNetTrainer(
        data_dir=settings.DATA_DIR,
        weights_dir=settings.WEIGHTS_DIR,
        device=device,
    )

    results = trainer.train(
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.lr,
        save_path=Path(args.output),
    )

    logger.info("=" * 60)
    logger.info("Training Completed Successfully!")
    logger.info(f"Final Test Accuracy: {results['final_accuracy']:.2f}%")
    logger.info(f"Saved weights to   : {results['weights_saved_to']}")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
