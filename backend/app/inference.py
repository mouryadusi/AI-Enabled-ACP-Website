"""
Inference orchestration layer.

Each `predict_*` function is a thin, swappable adapter: load the trained
artifact once at process start, transform the incoming flight/interaction
features into the shape the model expects, and return a calibrated
probability plus the feature attributions shown in the UI's explanation
panel. The functions below ship with a clearly-marked heuristic fallback so
the API is runnable end-to-end before real model artifacts are attached —
replace the marked block in each function with real model loading/inference.
"""
from __future__ import annotations

from app.schemas import ConflictFactor, ConflictStatus, ModelId

# Conflict-relevant feature set used across all three models. Note the
# data-integrity distinction this dissertation is careful about: the real
# model input is observed aircraft state (position, altitude, velocity,
# heading), graph-encoded per interaction. CPA-derived quantities (TCPA/
# DCPA) are label-generation / explanatory-validation logic, not inputs the
# model should see directly — including them as features would leak the
# thing the model is meant to predict. They're engineered here as a
# convenient flat feature vector for the XGBoost baseline specifically
# (which is allowed to use them, being a non-graph, feature-engineered
# comparison point) — the GCN/GAT adapters below should NOT include "tcpa"
# in their own node/edge features when real graph models are wired in.
FEATURE_ORDER = [
    "closing_rate",
    "horizontal_separation",
    "vertical_separation",
    "tcpa",
    "movement_pattern",
]


def _status_from_probability(p: float) -> ConflictStatus:
    if p >= 0.7:
        return "conflict"
    if p >= 0.3:
        return "caution"
    return "safe"


def predict(model: ModelId, features: dict[str, float]) -> tuple[float, list[ConflictFactor]]:
    """
    Dispatches to the requested model.

    --- Replace below with real inference ---
    XGBoost:
        import xgboost as xgb
        booster = xgb.Booster()
        booster.load_model(settings.XGBOOST_MODEL_PATH)
        dmatrix = xgb.DMatrix([[features[k] for k in FEATURE_ORDER]])
        probability = float(booster.predict(dmatrix)[0])
        contributions = booster.predict(dmatrix, pred_contribs=True)[0]

    GCN / GAT (PyTorch Geometric):
        graph = build_interaction_graph(features)  # nodes = nearby aircraft
        with torch.no_grad():
            logits = model(graph.x, graph.edge_index)
            probability = torch.sigmoid(logits[target_idx]).item()
        # For GAT, attention weights on incident edges double as factor
        # attributions for the explanation panel.
    --- End replace block ---
    """
    if model == "xgboost":
        probability = _heuristic_probability(features, sharpness=1.0)
    elif model == "gcn":
        probability = _heuristic_probability(features, sharpness=0.85)
    else:  # gat
        probability = _heuristic_probability(features, sharpness=0.6)

    factors = [
        ConflictFactor(label=_label(k), value=round(min(max(v, 0.0), 1.0), 3))
        for k, v in features.items()
    ]
    return probability, factors


def _heuristic_probability(features: dict[str, float], sharpness: float) -> float:
    """Deterministic stand-in used only until real model artifacts are wired
    in — a weighted blend of the engineered conflict features."""
    weights = {
        "closing_rate": 0.32,
        "horizontal_separation": 0.24,
        "vertical_separation": 0.2,
        "tcpa": 0.16,
        "movement_pattern": 0.08,
    }
    score = sum(features.get(k, 0.0) * w for k, w in weights.items())
    return round(min(max(score * sharpness, 0.0), 0.999), 3)


def _label(key: str) -> str:
    return {
        "closing_rate": "Closing rate",
        "horizontal_separation": "Horizontal separation",
        "vertical_separation": "Vertical separation",
        "tcpa": "Time to closest approach",
        "movement_pattern": "Aircraft movement pattern",
    }.get(key, key)


def status_for(probability: float) -> ConflictStatus:
    return _status_from_probability(probability)
