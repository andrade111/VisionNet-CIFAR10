"""
Integration tests for VisionNet FastAPI endpoints.
"""

import io
import sys
from pathlib import Path
import pytest
from PIL import Image
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app.main import app


@pytest.fixture
def client():
    """Return FastAPI TestClient."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_image_bytes():
    """Create in-memory PNG image bytes for testing."""
    img = Image.new("RGB", (64, 64), color=(255, 128, 0))
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer.getvalue()


def test_root_endpoint(client):
    """Test landing root response."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "VisionNet-CIFAR10"
    assert data["status"] == "online"


def test_cors_headers_for_frontend(client):
    """Test CORS preflight and headers allow Vite frontend requests."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    }
    # Preflight OPTIONS request
    response = client.options("/api/v1/predict", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "POST" in response.headers.get("access-control-allow-methods", "")

    # Actual GET request with Origin
    get_res = client.get("/api/v1/health", headers={"Origin": "http://localhost:5173"})
    assert get_res.status_code == 200
    assert get_res.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_health_check(client):
    """Test health check route."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "device" in data
    assert "version" in data


def test_model_info(client):
    """Test model metadata route."""
    response = client.get("/api/v1/model/info")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "VisionNet"
    assert data["num_classes"] == 10
    assert len(data["classes"]) == 10


def test_model_classes(client):
    """Test classes listing route."""
    response = client.get("/api/v1/model/classes")
    assert response.status_code == 200
    data = response.json()
    assert data["num_classes"] == 10
    assert "metadata" in data


def test_predict_endpoint_success(client, sample_image_bytes):
    """Test single image upload and classification."""
    files = {
        "file": ("test_airplane.png", sample_image_bytes, "image/png"),
    }
    response = client.post("/api/v1/predict?top_k=3", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["filename"] == "test_airplane.png"
    assert "inference_time_ms" in data
    assert "prediction" in data

    pred = data["prediction"]
    assert "predicted_label" in pred
    assert "confidence_percentage" in pred
    assert len(pred["top_k"]) == 3
    assert len(pred["all_probabilities"]) == 10


def test_predict_batch_endpoint_success(client, sample_image_bytes):
    """Test batch prediction with multiple images."""
    files = [
        ("files", ("image1.png", sample_image_bytes, "image/png")),
        ("files", ("image2.png", sample_image_bytes, "image/png")),
    ]
    response = client.post("/api/v1/predict/batch?top_k=2", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["total_images"] == 2
    assert len(data["results"]) == 2


def test_predict_invalid_file(client):
    """Test error handling when a non-image file is uploaded."""
    files = {
        "file": ("document.txt", b"plain text data", "text/plain"),
    }
    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 415
