# Aircraft Conflict Prediction — Inference Backend

FastAPI service that serves conflict predictions from the three models
evaluated in the dissertation (XGBoost, GCN, GAT) to the React frontend.

## Local development

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit CORS_ORIGINS as needed
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive OpenAPI docs.

## Wiring in trained models

`app/inference.py` contains a deterministic heuristic fallback so the API is
runnable immediately. Each model adapter in `app/models/` documents exactly
where to load a real artifact (`xgboost.Booster`, or a
`torch_geometric` `GCNConv` / `GATConv` stack) and how to run inference —
replace the marked blocks once trained weights are available, no other
files need to change.

## Deployment

**Render / Railway / Fly.io** (simplest):
- New Web Service → point at this `backend/` directory
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set `CORS_ORIGINS` to your deployed Vercel URL

**AWS (ECS Fargate / App Runner)**:
- Containerize with the provided `Dockerfile`
- Push to ECR, deploy via App Runner or an ECS service behind an ALB
- Store model artifact paths as environment variables / mount an EFS volume

Once deployed, set `VITE_API_BASE_URL` in the frontend's environment to this
service's URL.
