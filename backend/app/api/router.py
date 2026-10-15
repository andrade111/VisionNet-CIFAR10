"""
Main API router aggregator.
Includes health, model metadata, and inference sub-routers.
"""

from fastapi import APIRouter
from app.api.routes import health, model_info, predict

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(model_info.router)
api_router.include_router(predict.router)
