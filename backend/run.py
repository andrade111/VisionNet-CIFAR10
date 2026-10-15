"""
VisionNet-CIFAR10 Server Runner.
Entrypoint to run the FastAPI application with Uvicorn.
"""

import sys
from pathlib import Path
import uvicorn

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=1,
    )
