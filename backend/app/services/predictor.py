"""
VisionNet Predictor Service.
Handles model lifecycle, weight loading, GPU/CPU inference, and probability extraction.
"""

import time
from pathlib import Path
from typing import List, Optional, Tuple, Dict, Any
from PIL import Image
import torch
import torch.nn.functional as F

from app.config import settings
from app.core.device import get_device
from app.core.model import VisionNet
from app.core.transforms import get_inference_transforms
from app.schemas.prediction import (
    ClassProbability,
    PredictionResult,
    PredictionResponse,
    BatchPredictionResponse,
)
from app.schemas.health import ModelInfoResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)


class VisionNetPredictor:
    """
    Inference service managing model state, pre-processing, and forward pass execution.
    """

    def __init__(self, weights_path: Optional[Path] = None):
        self.weights_path = Path(weights_path or settings.MODEL_WEIGHTS_PATH)
        self.device = get_device()
        self.model: Optional[VisionNet] = None
        self.transform = get_inference_transforms()
        self.weights_loaded: bool = False
        self._initialize_model()

    def _initialize_model(self) -> None:
        """Instantiate VisionNet and load weights if available."""
        logger.info(f"Initializing VisionNet architecture on device: {self.device}")
        self.model = VisionNet(
            in_channels=settings.INPUT_CHANNELS,
            num_classes=settings.NUM_CLASSES,
        ).to(self.device)

        if self.weights_path.exists():
            try:
                state_dict = torch.load(self.weights_path, map_location=self.device, weights_only=True)
                self.model.load_state_dict(state_dict)
                self.weights_loaded = True
                logger.info(f"Successfully loaded trained weights from {self.weights_path}")
            except Exception as err:
                logger.error(f"Error loading weights from {self.weights_path}: {err}. Using initialized model.")
                self.weights_loaded = False
        else:
            logger.warning(
                f"No weights file found at '{self.weights_path}'. "
                "Model initialized with random weights. Train or provide weights for optimal accuracy."
            )
            self.weights_loaded = False

        self.model.eval()

    def reload_weights(self, new_weights_path: Optional[Path] = None) -> bool:
        """Reload weights from disk (useful after retraining)."""
        if new_weights_path:
            self.weights_path = Path(new_weights_path)
        self._initialize_model()
        return self.weights_loaded

    def predict(
        self,
        image: Image.Image,
        original_size: Tuple[int, int],
        filename: Optional[str] = None,
        top_k: int = settings.DEFAULT_TOP_K,
    ) -> PredictionResponse:
        """
        Execute full inference pipeline for a single image.

        Args:
            image: PIL Image in RGB format.
            original_size: (width, height) before preprocessing.
            filename: Original file name if provided.
            top_k: Number of highest ranking classes to include.

        Returns:
            Structured PredictionResponse with predictions and timing benchmarks.
        """
        start_total = time.perf_counter()

        # Step 1: Preprocessing & Transformation
        start_prep = time.perf_counter()
        img_tensor = self.transform(image)  # [3, 32, 32]
        img_tensor = img_tensor.unsqueeze(0).to(self.device)  # [1, 3, 32, 32]

        # Step 2: Forward Pass & Softmax
        start_infer = time.perf_counter()
        with torch.no_grad():
            logits = self.model(img_tensor)  # [1, 10]
            probabilities = F.softmax(logits, dim=1)[0]  # [10]
            confidence_val, predicted_idx = torch.max(probabilities, dim=0)

        end_infer = time.perf_counter()
        inference_time_ms = round((end_infer - start_infer) * 1000, 3)
        total_time_ms = round((end_infer - start_total) * 1000, 3)

        # Step 3: Format Probabilities and Class Rankings
        probs_np = probabilities.cpu().numpy()
        pred_idx_int = int(predicted_idx.item())
        pred_conf_float = float(confidence_val.item())

        # Top-K indices sorted by descending probability
        top_indices = probs_np.argsort()[::-1][: min(top_k, settings.NUM_CLASSES)]

        top_k_items: List[ClassProbability] = []
        for idx in top_indices:
            idx_int = int(idx)
            prob_val = float(probs_np[idx_int])
            meta = settings.CLASS_METADATA.get(idx_int, {})
            label = meta.get("label", settings.CLASSES[idx_int])
            top_k_items.append(
                ClassProbability(
                    class_index=idx_int,
                    label=label,
                    display_name=meta.get("display_name", label.capitalize()),
                    display_pt=meta.get("display_pt", label.capitalize()),
                    probability=round(prob_val, 4),
                    confidence_percentage=round(prob_val * 100, 2),
                )
            )

        # Complete dictionary of all 10 classes
        all_probs: Dict[str, float] = {
            settings.CLASSES[i]: round(float(probs_np[i]), 4)
            for i in range(settings.NUM_CLASSES)
        }

        pred_meta = settings.CLASS_METADATA.get(pred_idx_int, {})
        pred_label = pred_meta.get("label", settings.CLASSES[pred_idx_int])

        prediction_result = PredictionResult(
            predicted_class_index=pred_idx_int,
            predicted_label=pred_label,
            display_name=pred_meta.get("display_name", pred_label.capitalize()),
            display_pt=pred_meta.get("display_pt", pred_label.capitalize()),
            confidence=round(pred_conf_float, 4),
            confidence_percentage=round(pred_conf_float * 100, 2),
            top_k=top_k_items,
            all_probabilities=all_probs,
        )

        return PredictionResponse(
            success=True,
            filename=filename,
            inference_time_ms=inference_time_ms,
            total_time_ms=total_time_ms,
            device=str(self.device),
            original_image_size=original_size,
            transformed_image_size=settings.IMAGE_SIZE,
            prediction=prediction_result,
        )

    def predict_batch(
        self,
        images_data: List[Tuple[Image.Image, Tuple[int, int], Optional[str]]],
        top_k: int = settings.DEFAULT_TOP_K,
    ) -> BatchPredictionResponse:
        """
        Execute vectorized batch inference on multiple images.
        """
        if not images_data:
            return BatchPredictionResponse(
                success=True,
                total_images=0,
                batch_time_ms=0.0,
                device=str(self.device),
                results=[],
            )

        batch_start = time.perf_counter()

        # Vectorized batch tensor
        tensors = [self.transform(img) for img, _, _ in images_data]
        batch_tensor = torch.stack(tensors).to(self.device)  # [B, 3, 32, 32]

        with torch.no_grad():
            batch_logits = self.model(batch_tensor)  # [B, 10]
            batch_probs = F.softmax(batch_logits, dim=1)  # [B, 10]

        batch_end = time.perf_counter()
        batch_time_ms = round((batch_end - batch_start) * 1000, 3)

        results: List[PredictionResponse] = []
        batch_probs_cpu = batch_probs.cpu().numpy()

        for idx, (img, orig_size, fname) in enumerate(images_data):
            probs_np = batch_probs_cpu[idx]
            pred_idx = int(probs_np.argmax())
            confidence_val = float(probs_np[pred_idx])

            top_indices = probs_np.argsort()[::-1][: min(top_k, settings.NUM_CLASSES)]
            top_k_items: List[ClassProbability] = []
            for t_idx in top_indices:
                t_idx_int = int(t_idx)
                prob_val = float(probs_np[t_idx_int])
                meta = settings.CLASS_METADATA.get(t_idx_int, {})
                label = meta.get("label", settings.CLASSES[t_idx_int])
                top_k_items.append(
                    ClassProbability(
                        class_index=t_idx_int,
                        label=label,
                        display_name=meta.get("display_name", label.capitalize()),
                        display_pt=meta.get("display_pt", label.capitalize()),
                        probability=round(prob_val, 4),
                        confidence_percentage=round(prob_val * 100, 2),
                    )
                )

            all_probs = {
                settings.CLASSES[i]: round(float(probs_np[i]), 4)
                for i in range(settings.NUM_CLASSES)
            }

            pred_meta = settings.CLASS_METADATA.get(pred_idx, {})
            pred_label = pred_meta.get("label", settings.CLASSES[pred_idx])

            prediction_result = PredictionResult(
                predicted_class_index=pred_idx,
                predicted_label=pred_label,
                display_name=pred_meta.get("display_name", pred_label.capitalize()),
                display_pt=pred_meta.get("display_pt", pred_label.capitalize()),
                confidence=round(confidence_val, 4),
                confidence_percentage=round(confidence_val * 100, 2),
                top_k=top_k_items,
                all_probabilities=all_probs,
            )

            results.append(
                PredictionResponse(
                    success=True,
                    filename=fname,
                    inference_time_ms=round(batch_time_ms / len(images_data), 3),
                    total_time_ms=batch_time_ms,
                    device=str(self.device),
                    original_image_size=orig_size,
                    transformed_image_size=settings.IMAGE_SIZE,
                    prediction=prediction_result,
                )
            )

        return BatchPredictionResponse(
            success=True,
            total_images=len(results),
            batch_time_ms=batch_time_ms,
            device=str(self.device),
            results=results,
        )

    def get_info(self) -> ModelInfoResponse:
        """Retrieve full model specifications and parameter metrics."""
        summary = self.model.get_architecture_summary()
        return ModelInfoResponse(
            model_name="VisionNet",
            framework="PyTorch",
            version="1.0.0",
            dataset="CIFAR-10",
            num_classes=settings.NUM_CLASSES,
            classes=list(settings.CLASSES),
            class_metadata=settings.CLASS_METADATA,
            input_resolution=list(settings.IMAGE_SIZE),
            input_channels=settings.INPUT_CHANNELS,
            weights_path=str(self.weights_path),
            weights_loaded=self.weights_loaded,
            total_parameters=summary["parameters"]["total_parameters"],
            trainable_parameters=summary["parameters"]["trainable_parameters"],
            device=str(self.device),
            architecture=summary,
        )


# Global singleton predictor instance
_predictor_instance: Optional[VisionNetPredictor] = None


def get_predictor() -> VisionNetPredictor:
    """Dependency provider returning singleton VisionNetPredictor."""
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = VisionNetPredictor()
    return _predictor_instance
