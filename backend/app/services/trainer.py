"""
VisionNet Training and Evaluation Engine.
Provides modular training, validation loops, and per-class performance analytics.
"""

from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision
import torchvision.datasets as datasets

from app.config import settings
from app.core.device import get_device
from app.core.model import VisionNet
from app.core.transforms import get_train_transforms, get_eval_transforms
from app.utils.logger import get_logger

logger = get_logger(__name__)


class VisionNetTrainer:
    """
    Manages the complete training and evaluation lifecycle of VisionNet on CIFAR-10.
    """

    def __init__(
        self,
        data_dir: Optional[Path] = None,
        weights_dir: Optional[Path] = None,
        device: Optional[torch.device] = None,
    ):
        self.data_dir = Path(data_dir or settings.DATA_DIR)
        self.weights_dir = Path(weights_dir or settings.WEIGHTS_DIR)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.weights_dir.mkdir(parents=True, exist_ok=True)
        self.device = device or get_device()
        self.model = VisionNet(
            in_channels=settings.INPUT_CHANNELS,
            num_classes=settings.NUM_CLASSES,
        ).to(self.device)

    def prepare_dataloaders(
        self,
        batch_size: int = settings.DEFAULT_BATCH_SIZE,
        num_workers: int = 0,
    ) -> Tuple[DataLoader, DataLoader]:
        """Download CIFAR-10 dataset if missing and construct DataLoaders."""
        logger.info(f"Loading CIFAR-10 dataset from: {self.data_dir}")

        train_dataset = datasets.CIFAR10(
            root=str(self.data_dir),
            train=True,
            download=True,
            transform=get_train_transforms(),
        )

        test_dataset = datasets.CIFAR10(
            root=str(self.data_dir),
            train=False,
            download=True,
            transform=get_eval_transforms(),
        )

        train_loader = DataLoader(
            train_dataset,
            batch_size=batch_size,
            shuffle=True,
            num_workers=num_workers,
        )

        test_loader = DataLoader(
            test_dataset,
            batch_size=batch_size,
            shuffle=False,
            num_workers=num_workers,
        )

        logger.info(
            f"Dataset loaded: {len(train_dataset)} training samples, "
            f"{len(test_dataset)} test samples."
        )
        return train_loader, test_loader

    def train(
        self,
        epochs: int = settings.DEFAULT_EPOCHS,
        batch_size: int = settings.DEFAULT_BATCH_SIZE,
        learning_rate: float = settings.DEFAULT_LEARNING_RATE,
        save_path: Optional[Path] = None,
    ) -> Dict[str, Any]:
        """
        Execute full training procedure.

        Args:
            epochs: Total epochs to run.
            batch_size: Batch size for mini-batch gradient descent.
            learning_rate: Learning rate for Adam optimizer.
            save_path: Output file path for trained .pth weights.

        Returns:
            Dictionary with training history and final evaluation metrics.
        """
        output_path = Path(save_path or settings.MODEL_WEIGHTS_PATH)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        train_loader, test_loader = self.prepare_dataloaders(batch_size=batch_size)

        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)

        history = []
        total_start = time.perf_counter()

        logger.info(
            f"Starting VisionNet training for {epochs} epochs on {self.device}. "
            f"Batch Size: {batch_size}, LR: {learning_rate}"
        )

        for epoch in range(epochs):
            self.model.train()
            running_loss = 0.0
            total_batches = len(train_loader)
            epoch_start = time.perf_counter()

            for step, (images, labels) in enumerate(train_loader):
                images = images.to(self.device)
                labels = labels.to(self.device)

                # Forward pass
                outputs = self.model(images)
                loss = criterion(outputs, labels)

                # Backpropagation
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

                running_loss += loss.item()

            epoch_loss = running_loss / total_batches

            # Validation pass
            eval_metrics = self.evaluate(test_loader)
            epoch_duration = round(time.perf_counter() - epoch_start, 2)

            epoch_record = {
                "epoch": epoch + 1,
                "train_loss": round(epoch_loss, 4),
                "test_accuracy": eval_metrics["overall_accuracy"],
                "duration_seconds": epoch_duration,
            }
            history.append(epoch_record)

            logger.info(
                f"Epoch [{epoch + 1}/{epochs}] | "
                f"Train Loss: {epoch_loss:.4f} | "
                f"Test Acc: {eval_metrics['overall_accuracy']:.2f}% | "
                f"Time: {epoch_duration}s"
            )

        total_duration = round(time.perf_counter() - total_start, 2)

        # Final evaluation with per-class breakdown
        final_eval = self.evaluate(test_loader, detailed=True)

        # Save model weights
        torch.save(self.model.state_dict(), output_path)
        logger.info(f"Model weights successfully saved to: {output_path}")

        return {
            "status": "success",
            "weights_saved_to": str(output_path),
            "total_duration_seconds": total_duration,
            "final_accuracy": final_eval["overall_accuracy"],
            "per_class_accuracy": final_eval.get("per_class_accuracy", {}),
            "history": history,
        }

    def evaluate(self, test_loader: DataLoader, detailed: bool = False) -> Dict[str, Any]:
        """
        Evaluate model performance on the test dataset.
        """
        self.model.eval()
        n_correct = 0
        n_samples = 0
        num_classes = settings.NUM_CLASSES

        n_class_correct = [0 for _ in range(num_classes)]
        n_class_samples = [0 for _ in range(num_classes)]

        with torch.no_grad():
            for images, labels in test_loader:
                images = images.to(self.device)
                labels = labels.to(self.device)

                outputs = self.model(images)
                _, predicted = torch.max(outputs, 1)

                n_samples += labels.size(0)
                n_correct += (predicted == labels).sum().item()

                if detailed:
                    for i in range(len(labels)):
                        lbl = labels[i].item()
                        prd = predicted[i].item()
                        if lbl == prd:
                            n_class_correct[lbl] += 1
                        n_class_samples[lbl] += 1

        overall_acc = round(100.0 * n_correct / n_samples, 2) if n_samples > 0 else 0.0
        results: Dict[str, Any] = {
            "overall_accuracy": overall_acc,
            "total_samples": n_samples,
            "correct_samples": n_correct,
        }

        if detailed:
            per_class = {}
            for i in range(num_classes):
                c_name = settings.CLASSES[i]
                c_acc = (
                    round(100.0 * n_class_correct[i] / n_class_samples[i], 2)
                    if n_class_samples[i] > 0
                    else 0.0
                )
                per_class[c_name] = {
                    "accuracy": c_acc,
                    "correct": n_class_correct[i],
                    "total": n_class_samples[i],
                }
            results["per_class_accuracy"] = per_class

        return results
