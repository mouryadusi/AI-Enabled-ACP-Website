import type { MockFlight } from "@/data/mission";
import { mockFlights } from "@/data/mission";
const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL ||
"https://aircraft-conflict-gnn.onrender.com";

export interface ConflictPrediction {
flightId: string;
status: "safe" | "caution" | "conflict";
probability: number;
model: "xgboost" | "gcn" | "gat";
factors: { label: string; value: number }[];
}

/**

Convert an unknown API value into a valid probability in the
0..1 range.
Supports both:
0.87
and:
87
*/
function normalizeProbability(value: unknown): number | null {
if (value === null || value === undefined) {
return null;
}
const numberValue =
typeof value === "number"
? value
: Number(value);
if (!Number.isFinite(numberValue)) {
return null;
}

const probability =
numberValue > 1
? numberValue / 100
: numberValue;

return Math.min(1, Math.max(0, probability));
}

function normalizeStatus(
value: unknown,
): ConflictPrediction["status"] | null {
if (
value === "safe" ||
value === "caution" ||
value === "conflict"
) {
return value;
}

return null;
}

function normalizeModel(
value: unknown,
fallback: ConflictPrediction["model"],
): ConflictPrediction["model"] {
if (
value === "xgboost" ||
value === "gcn" ||
value === "gat"
) {
return value;
}

return fallback;
}

function normalizeFactors(
value: unknown,
): { label: string; value: number }[] {
if (!Array.isArray(value)) {
return [];
}

return value
.map((factor) => {
if (!factor || typeof factor !== "object") {
return null;
}

  const item = factor as Record<string, unknown>;

  const label =
    typeof item.label === "string"
      ? item.label
      : null;

  const numericValue = Number(item.value);

  if (
    !label ||
    !Number.isFinite(numericValue)
  ) {
    return null;
  }

  return {
    label,
    value: numericValue,
  };
})
.filter(
  (
    factor,
  ): factor is {
    label: string;
    value: number;
  } => factor !== null,
);
}
/**

Requests a conflict prediction from the FastAPI backend.
If the backend is unreachable OR returns malformed prediction
data, the bundled mock prediction is used instead.
*/
export async function fetchConflictPrediction(
flightId: string,
model: ConflictPrediction["model"] = "xgboost",
): Promise<ConflictPrediction> {
const flight = getFlight(flightId);
try {
const res = await fetch(
${API_BASE_URL}/predict,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
x: [
[
flight.originLat,
flight.originLng,
flight.altitudeFt,
flight.speedKts,
flight.headingDeg,
flight.nearbyTraffic,
],
[
flight.destLat,
flight.destLng,
flight.altitudeFt -
flight.verticalSeparationFt,
Math.max(
0,
flight.speedKts -
flight.closingRateKts,
),
(flight.headingDeg + 180) % 360,
Math.max(
0,
flight.nearbyTraffic - 1,
),
],
],
      edge_index: [
        [0, 1],
        [1, 0],
      ],

      edge_attr: [
        [
          flight.separationNm,
          flight.verticalSeparationFt,
          flight.closingRateKts,
          flight.tcpaSeconds,
          flight.dcpaNm,
          flight.nearbyTraffic,
        ],
        [
          flight.separationNm,
          flight.verticalSeparationFt,
          flight.closingRateKts,
          flight.tcpaSeconds,
          flight.dcpaNm,
          flight.nearbyTraffic,
        ],
      ],
    }),

    signal: AbortSignal.timeout(2500),
  },
);

if (!res.ok) {
  throw new Error(
    `Backend responded ${res.status}`,
  );
}

const data: unknown = await res.json();

if (
  !data ||
  typeof data !== "object"
) {
  throw new Error(
    "Backend returned an invalid response",
  );
}

const response =
  data as Record<string, unknown>;

/*
 * Accept the expected field first, while also supporting
 * common alternate names returned by ML APIs.
 */
const rawProbability =
  response.probability ??
  response.conflict_probability ??
  response.conflictProbability ??
  response.risk_probability ??
  response.riskProbability;

const probability =
  normalizeProbability(rawProbability);

if (probability === null) {
  console.warn(
    "Backend returned invalid probability. Falling back to mock prediction.",
    response,
  );

  throw new Error(
    "Backend returned an invalid probability",
  );
}

const status =
  normalizeStatus(response.status);

if (!status) {
  console.warn(
    "Backend returned invalid status. Falling back to mock prediction.",
    response,
  );

  throw new Error(
    "Backend returned an invalid status",
  );
}

const backendFlightId =
  typeof response.flight_id === "string"
    ? response.flight_id
    : flight.id;

return {
  flightId: backendFlightId,
  status,
  probability,
  model: normalizeModel(
    response.model,
    model,
  ),
  factors: normalizeFactors(
    response.factors,
  ),
};
} catch (error) {
/*
* The fallback is intentional. A malformed or unavailable
* backend must never crash the React application.
*/
console.warn(
"Conflict prediction backend unavailable. Using mock prediction.",
error,
);
return mockPredict(
  flightId,
  model,
);
}
}
function mockPredict(
flightId: string,
model: ConflictPrediction["model"],
): ConflictPrediction {
const flight =
mockFlights.find(
(f) => f.id === flightId,
) ?? mockFlights[0];

const probability =
flight.status === "conflict"
? 0.87
: flight.status === "caution"
? 0.48
: 0.06;

return {
flightId: flight.id,
status: flight.status,
probability,
model,
factors: Array.isArray(flight.factors)
? flight.factors
: [],
};
}

export function getFlight(
flightId: string,
): MockFlight {
return (
mockFlights.find(
(f) => f.id === flightId,
) ?? mockFlights[0]
);
}
