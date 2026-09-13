"""Pydantic request/response contracts shared by all model backends."""
from typing import Literal

from pydantic import BaseModel, Field

ModelId = Literal["xgboost", "gcn", "gat"]
ConflictStatus = Literal["safe", "caution", "conflict"]


class PredictRequest(BaseModel):
    flight_id: str = Field(..., description="Identifier of the flight to score")
    model: ModelId = Field("xgboost", description="Which trained model to run")


class ConflictFactor(BaseModel):
    label: str
    value: float = Field(..., ge=0, le=1)


class PredictResponse(BaseModel):
    flight_id: str
    model: ModelId
    status: ConflictStatus
    probability: float = Field(..., ge=0, le=1)
    factors: list[ConflictFactor]


class ModelMetrics(BaseModel):
    id: ModelId
    name: str
    f1: float
    roc_auc: float
