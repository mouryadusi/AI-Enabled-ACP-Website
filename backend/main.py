"""
FastAPI inference backend for AI-Enabled Aircraft Conflict Prediction.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Endpoints:
    GET  /api/v1/health           liveness check
    GET  /api/v1/models           metrics for all three evaluated models
    POST /api/v1/predict          run a conflict prediction for a flight

The frontend (src/lib/api.ts) calls POST /api/v1/predict and gracefully
falls back to bundled mock data if this service is unreachable, so the two
can be developed and deployed independently.
"""
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.inference import predict, status_for
from app.models import gat_model, gcn_model, xgboost_model
from app.schemas import ModelMetrics, PredictRequest, PredictResponse

app = FastAPI(
    title="Aircraft Conflict Prediction API",
    description="Serves XGBoost / GCN / GAT conflict predictions for the frontend simulator.",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# In-memory demo flight store, mirroring src/data/mission.ts. In production
# this would be replaced by a lookup into your trajectory/feature store,
# keyed by flight_id, populated from OpenSky/ADS-B Exchange + ERA5.
DEMO_FEATURES: dict[str, dict[str, float]] = {
    "fl-1": {
        "closing_rate": 0.91,
        "horizontal_separation": 0.74,
        "vertical_separation": 0.68,
        "tcpa": 0.83,
        "movement_pattern": 0.42,
    },
    "fl-2": {
        "closing_rate": 0.52,
        "horizontal_separation": 0.46,
        "vertical_separation": 0.31,
        "tcpa": 0.49,
        "movement_pattern": 0.22,
    },
    "fl-3": {
        "closing_rate": 0.14,
        "horizontal_separation": 0.09,
        "vertical_separation": 0.07,
        "tcpa": 0.11,
        "movement_pattern": 0.08,
    },
    "fl-4": {
        "closing_rate": 0.61,
        "horizontal_separation": 0.53,
        "vertical_separation": 0.44,
        "tcpa": 0.57,
        "movement_pattern": 0.26,
    },
}


@app.get("/api/v1/health")
def health():
    return {"status": "ok"}


@app.get("/api/v1/models", response_model=list[ModelMetrics])
def list_models():
    return [
        ModelMetrics(id="xgboost", name=xgboost_model.MODEL_NAME, f1=xgboost_model.F1, roc_auc=xgboost_model.ROC_AUC),
        ModelMetrics(id="gcn", name=gcn_model.MODEL_NAME, f1=gcn_model.F1, roc_auc=gcn_model.ROC_AUC),
        ModelMetrics(id="gat", name=gat_model.MODEL_NAME, f1=gat_model.F1, roc_auc=gat_model.ROC_AUC),
    ]


@app.post("/api/v1/predict", response_model=PredictResponse)
def predict_conflict(req: PredictRequest):
    features = DEMO_FEATURES.get(req.flight_id)
    if features is None:
        raise HTTPException(status_code=404, detail=f"Unknown flight_id '{req.flight_id}'")

    probability, factors = predict(req.model, features)
    return PredictResponse(
        flight_id=req.flight_id,
        model=req.model,
        status=status_for(probability),
        probability=probability,
        factors=factors,
    )
