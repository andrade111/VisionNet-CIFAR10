"""
VisionNet Convolutional Neural Network (CNN) Architecture.
Optimized for 32x32 RGB image classification on the CIFAR-10 dataset.
"""

from typing import Dict, Any
import torch
import torch.nn as nn
import torch.nn.functional as F


class VisionNet(nn.Module):
    """
    VisionNet Convolutional Neural Network.

    Architecture Overview:
        Input: [Batch, 3, 32, 32]
        Stage 1: Conv2d(3 -> 6, kernel=5) -> ReLU -> MaxPool2d(2, 2)  => [Batch, 6, 14, 14]
        Stage 2: Conv2d(6 -> 16, kernel=5) -> ReLU -> MaxPool2d(2, 2) => [Batch, 16, 5, 5]
        Flatten: 16 * 5 * 5 = 400 features
        Stage 3: Linear(400 -> 120) -> ReLU
        Stage 4: Linear(120 -> 84) -> ReLU
        Output : Linear(84 -> num_classes) (Raw logits)
    """

    def __init__(self, in_channels: int = 3, num_classes: int = 10):
        super(VisionNet, self).__init__()
        self.in_channels = in_channels
        self.num_classes = num_classes

        # Feature Extraction Layers
        self.conv1 = nn.Conv2d(in_channels=in_channels, out_channels=6, kernel_size=5)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.conv2 = nn.Conv2d(in_channels=6, out_channels=16, kernel_size=5)

        # Decision Layers (Fully Connected)
        self.fc1 = nn.Linear(in_features=16 * 5 * 5, out_features=120)
        self.fc2 = nn.Linear(in_features=120, out_features=84)
        self.fc3 = nn.Linear(in_features=84, out_features=num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass through the convolutional and linear layers.

        Args:
            x: Input tensor of shape [batch_size, 3, 32, 32].

        Returns:
            Output logits tensor of shape [batch_size, num_classes].
        """
        # Feature extraction with activation and spatial downsampling
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))

        # Flatten spatial dimensions into feature vector: [B, 16, 5, 5] -> [B, 400]
        x = torch.flatten(x, start_dim=1)

        # Classification head with non-linear projections
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)

        return x

    def get_num_parameters(self) -> Dict[str, int]:
        """Compute the total and trainable parameter counts."""
        total = sum(p.numel() for p in self.parameters())
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        return {"total_parameters": total, "trainable_parameters": trainable}

    def get_architecture_summary(self) -> Dict[str, Any]:
        """Return structural metadata about the model."""
        params = self.get_num_parameters()
        return {
            "model_name": "VisionNet",
            "task": "Image Classification",
            "input_resolution": [32, 32],
            "input_channels": self.in_channels,
            "num_classes": self.num_classes,
            "layers": [
                {"name": "conv1", "type": "Conv2d", "in_channels": 3, "out_channels": 6, "kernel_size": 5},
                {"name": "pool1", "type": "MaxPool2d", "kernel_size": 2, "stride": 2},
                {"name": "conv2", "type": "Conv2d", "in_channels": 6, "out_channels": 16, "kernel_size": 5},
                {"name": "pool2", "type": "MaxPool2d", "kernel_size": 2, "stride": 2},
                {"name": "fc1", "type": "Linear", "in_features": 400, "out_features": 120},
                {"name": "fc2", "type": "Linear", "in_features": 120, "out_features": 84},
                {"name": "fc3", "type": "Linear", "in_features": 84, "out_features": self.num_classes},
            ],
            "parameters": params,
        }


# Alias for backward compatibility
ConvNet = VisionNet
