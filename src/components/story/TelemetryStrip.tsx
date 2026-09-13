import { useEffect, useState } from "react";
import { mockFlights } from "@/data/mission";

/**
 * A thin, constantly-updating instrument strip — coordinates, altitude, a
 * ticking clock, and an oscillating "AI confidence" figure drawn from the
 * same mock flight data used throughout the site. Explicitly labelled as
 * simulated research telemetry (see the caption), not a live feed. Exists
 * to turn what would otherwise be empty space into something that reads as
 * "this page is a live instrument", per the brief's own framing.
 */
export function TelemetryStrip() {
  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    const clockId = setInterval(() => setClock(new Date()), 1000);
    return () => {
      clearInterval(id);
      clearInterval(clockId);
    };
  }, []);

  const flight = mockFlights[tick % mockFlights.length];
  const confidence = 62 + Math.round(30 * Math.abs(Math.sin(tick * 0.7)));
  const utc = clock.toISOString().slice(11, 19);

  return (
    <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
      <Field label="UTC" value={utc} />
      <Field label="Track" value={flight.callsign} />
      <Field label="Coord" value={`${flight.originLat.toFixed(2)}, ${flight.originLng.toFixed(2)}`} />
      <Field label="Alt" value={`${flight.altitudeFt.toLocaleString()} ft`} />
      <Field label="AI confidence" value={`${confidence}%`} accent />
      <span className="text-ink-faint/50">&middot; simulated research telemetry</span>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-ink-faint/60">{label}</span>
      <span className={accent ? "text-accent" : "text-ink-muted"}>{value}</span>
    </span>
  );
}
