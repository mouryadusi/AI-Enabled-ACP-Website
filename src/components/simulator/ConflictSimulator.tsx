import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockFlights, modelResults } from "@/data/mission";
import { fetchConflictPrediction, type ConflictPrediction } from "@/lib/api";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { FlightSelector } from "@/components/simulator/FlightSelector";
import { RiskGauge } from "@/components/simulator/RiskGauge";
import { InteractionGraph } from "@/components/simulator/InteractionGraph";
import { PipelineStepper } from "@/components/simulator/PipelineStepper";
import { cx } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  safe: "NORMAL",
  caution: "ELEVATED",
  conflict: "CONFLICT",
};

const STATUS_TEXT_COLOR: Record<string, string> = {
  safe: "text-signal-safe",
  caution: "text-signal-caution",
  conflict: "text-signal-conflict",
};

const RISK_TEXT_COLOR: Record<string, string> = {
  low: "text-signal-safe",
  medium: "text-signal-caution",
  high: "text-signal-conflict",
};

export function ConflictSimulator() {
  const [selectedId, setSelectedId] = useState(mockFlights[0].id);
  const [model, setModel] = useState<ConflictPrediction["model"]>("xgboost");
  const [prediction, setPrediction] = useState<ConflictPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const flight = mockFlights.find((f) => f.id === selectedId) ?? mockFlights[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchConflictPrediction(selectedId, model).then((res) => {
      if (!cancelled) {
        setPrediction(res);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId, model]);

  return (
    <section id="simulator" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mb-6">
        <p className="eyebrow">Interactive Prototype</p>
        <h2 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
          Aircraft Interaction Prediction
        </h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          The model predicts whether an aircraft interaction is likely to
          enter a conflict, based on observed spatial and kinematic
          relationships — not on any single aircraft in isolation.
        </p>
      </div>

      <div className="mb-8">
        <PipelineStepper />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <GlassPanel className="p-5 lg:col-span-3">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Select Flight
          </p>
          <FlightSelector selectedId={selectedId} onSelect={setSelectedId} />
        </GlassPanel>

        <GlassPanel className="p-6 lg:col-span-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-xl text-ink">{flight.callsign}</p>
              <p className="text-sm text-ink-muted">
                {flight.operator} &middot; {flight.aircraftType}
              </p>
            </div>
            <div className="flex rounded-full border border-line/70 p-0.5">
              {modelResults.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  data-cursor="hover"
                  className={cx(
                    "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                    model === m.id ? "bg-radar text-void" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {m.id === "gcn" ? "GCN" : m.id === "gat" ? "GAT" : "XGB"}
                </button>
              ))}
            </div>
          </div>

          {/* Observed state — the actual model inputs: position, altitude,
              velocity, heading. Nothing derived from CPA logic appears here. */}
          <div className="mt-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Observed state &middot; model input
            </p>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
              <Metric label="Altitude" value={`${flight.altitudeFt.toLocaleString()} ft`} />
              <Metric label="Heading" value={`${flight.headingDeg}°`} />
              <Metric label="Speed" value={`${flight.speedKts} kts`} />
              <Metric label="Nearby traffic" value={`${flight.nearbyTraffic} ac`} />
            </div>
          </div>

          {/* Explanatory / validation metrics — CPA-derived figures used to
              interpret and sanity-check the prediction, not fed to the model
              as inputs. Kept visually and semantically separate from the
              observed state above. */}
          <div className="mt-5 border-t border-line/60 pt-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              Explanatory &amp; validation metrics
            </p>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-3">
              <Metric label="Horiz. separation" value={`${flight.separationNm} nm`} />
              <Metric label="Vert. separation" value={`${flight.verticalSeparationFt} ft`} />
              <Metric label="Relative speed" value={`${flight.closingRateKts} kt`} />
              <Metric label="Predicted CPA" value={`${flight.dcpaNm} nm`} />
              <Metric label="Time to CPA" value={`${flight.tcpaSeconds} s`} />
            </div>
          </div>

          <div className="mt-6 border-t border-line/60 pt-5">
            <InteractionGraph flight={flight} />
          </div>
        </GlassPanel>

        <GlassPanel className="flex flex-col items-center justify-center p-6 lg:col-span-4">
          <AnimatePresence mode="wait">
            {loading || !prediction ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-64 flex-col items-center justify-center gap-3"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-radar/30 border-t-radar" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  Running inference…
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={prediction.flightId + prediction.model}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-full flex-col items-center text-center"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Prediction
                </p>
                <p className={cx("mt-1 font-display text-2xl", STATUS_TEXT_COLOR[prediction.status])}>
                  {STATUS_LABEL[prediction.status]}
                </p>

                <div className="mt-4">
                  <RiskGauge probability={prediction.probability} status={prediction.status} />
                </div>

                <div className="mt-2 grid w-full grid-cols-2 gap-3 border-t border-line/60 pt-4 font-mono text-xs">
                  <div>
                    <p className="text-ink-faint">Conflict probability</p>
                    <p className="mt-0.5 text-ink">{prediction.probability.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint">Risk level</p>
                    <p className={cx("mt-0.5 uppercase", RISK_TEXT_COLOR[flight.riskLevel])}>
                      {flight.riskLevel}
                    </p>
                  </div>
                </div>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  Model: {prediction.model.toUpperCase()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-ink-faint">{label}</p>
      <p className="mt-0.5 text-ink">{value}</p>
    </div>
  );
}
