import type { MockFlight } from "@/data/mission";
import { mockFlights } from "@/data/mission";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface ConflictPrediction {
  flightId: string;
  status: "safe" | "caution" | "conflict";
  probability: number;
  model: "xgboost" | "gcn" | "gat";
  factors: { label: string; value: number }[];
}

/**
 * Requests a conflict prediction for a given flight from the FastAPI backend
 * (see /backend/main.py, POST /api/v1/predict). Falls back to the bundled
 * mock dataset if the backend is unreachable — this keeps the frontend fully
 * demoable without infrastructure, while remaining a one-line swap once the
 * backend is deployed.
 */
export async function fetchConflictPrediction(
  flightId: string,
  model: ConflictPrediction["model"] = "xgboost",
): Promise<ConflictPrediction> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flight_id: flightId, model }),
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    const data = await res.json();
    return {
      flightId: data.flight_id,
      status: data.status,
      probability: data.probability,
      model: data.model,
      factors: data.factors,
    };
  } catch {
    return mockPredict(flightId, model);
  }
}

function mockPredict(
  flightId: string,
  model: ConflictPrediction["model"],
): ConflictPrediction {
  const flight = mockFlights.find((f) => f.id === flightId) ?? mockFlights[0];
  const probability =
    flight.status === "conflict" ? 0.87 : flight.status === "caution" ? 0.48 : 0.06;
  return {
    flightId: flight.id,
    status: flight.status,
    probability,
    model,
    factors: flight.factors,
  };
}

export function getFlight(flightId: string): MockFlight {
  return mockFlights.find((f) => f.id === flightId) ?? mockFlights[0];
}
