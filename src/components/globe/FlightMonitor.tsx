import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockFlights, type MockFlight } from "@/data/mission";

const STATUS_COLOR: Record<string, string> = {
  safe: "#3FDE8F",
  caution: "#FFB020",
  conflict: "#FF5C4D",
};

const VB = 100;
function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * VB, y: ((90 - lat) / 180) * (VB * 0.62) + VB * 0.19 };
}

// Relative altitude band, purely for the depth cue (tick height) — not a
// real vertical projection, just an honest visual proxy for "higher/lower".
function altitudeBand(ft: number) {
  const min = 30000;
  const max = 42000;
  return Math.max(0, Math.min(1, (ft - min) / (max - min)));
}

/**
 * The primary "Global Flight Conflict Monitor" — an AI-monitoring-console
 * read on the same flight data as the rest of the site, not a map. A
 * rotating radar sweep, range rings, heading-oriented aircraft markers, an
 * explicit conflict-zone highlight between aircraft flagged as converging,
 * a running simulated-time index, and a per-aircraft altitude tick as a
 * depth cue. Hovering a marker surfaces its full telemetry. Pure SVG/DOM —
 * no WebGL, so it always renders.
 */
export function FlightMonitor() {
  const [active, setActive] = useState<MockFlight | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const conflictFlights = mockFlights.filter((f) => f.status === "conflict");
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(79,216,224,0.06),transparent_70%)]">
      {/* Simulated-data badge — prominent, not a corner footnote */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-signal-caution/40 bg-signal-caution/10 px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-caution" />
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-signal-caution">
          Simulated data &middot; not live ATC
        </span>
      </div>

      {/* Running simulated time index — the temporal-progression cue */}
      <div className="absolute right-3 top-3 z-10 font-mono text-[10px] tabular-nums text-ink-faint">
        T+{mm}:{ss}
      </div>

      {/* Honest alternative to a fake FlightRadar24 embed: FR24's real
          live-tracking API requires a paid Business subscription and a
          server-held key — no legitimate free embed exists for this today.
          Linking out is always legitimate; faking the integration isn't. */}
      <a
        href="https://www.flightradar24.com/"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="nav"
        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-line/70 bg-panel/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-ink-muted backdrop-blur-sm transition-colors hover:text-accent"
      >
        View live traffic on FlightRadar24
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
          <path d="M3 9 L9 3 M9 3 H4.5 M9 3 V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* range rings */}
      <svg viewBox={`0 0 ${VB} ${VB}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {[14, 26, 38].map((r) => (
          <circle key={r} cx={VB / 2} cy={VB / 2} r={r} fill="none" stroke="currentColor" strokeWidth="0.15" className="text-radar/25" />
        ))}
        <line x1={VB / 2} y1="4" x2={VB / 2} y2={VB - 4} stroke="currentColor" strokeWidth="0.1" className="text-radar/15" />
        <line x1="4" y1={VB / 2} x2={VB - 4} y2={VB / 2} stroke="currentColor" strokeWidth="0.1" className="text-radar/15" />
      </svg>

      {/* rotating sweep */}
      <div className="absolute inset-0 animate-[spin_7s_linear_infinite] [transform-origin:50%_50%]">
        <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left bg-[conic-gradient(from_0deg,rgba(79,216,224,0.28),transparent_26%)]" />
      </div>

      <svg viewBox={`0 0 ${VB} ${VB}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {/* Explicit conflict-zone highlight: a pulsing ring around any
            aircraft the model has flagged, plus a shaded halo — so the
            reason for the alert is visually obvious, not just a red dot. */}
        {conflictFlights.map((f) => {
          const p = project(f.originLat, f.originLng);
          return (
            <motion.circle
              key={`zone-${f.id}`}
              cx={p.x}
              cy={p.y}
              r="6"
              fill="#FF5C4D"
              fillOpacity="0.07"
              stroke="#FF5C4D"
              strokeWidth="0.3"
              animate={{ r: [5, 7.5, 5], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}

        {mockFlights.map((f) => {
          const start = project(f.originLat, f.originLng);
          const end = project(f.destLat, f.destLng);
          const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 8 };
          const color = STATUS_COLOR[f.status];
          const path = `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`;
          const band = altitudeBand(f.altitudeFt);

          return (
            <g key={f.id}>
              <path d={path} fill="none" stroke={color} strokeWidth="0.3" opacity="0.55" />

              {/* aircraft continuously moving along its route, oriented to heading */}
              <motion.g
                animate={{ x: [start.x, mid.x, end.x], y: [start.y, mid.y, end.y] }}
                transition={{
                  duration: 9 + (f.id.charCodeAt(f.id.length - 1) % 6),
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <g transform={`rotate(${f.headingDeg})`}>
                  <path d="M -1.1 0.8 L 0 -1.3 L 1.1 0.8 L 0 0.2 Z" fill={color} />
                </g>
              </motion.g>

              {/* altitude tick — a small depth cue, height proportional to
                  this aircraft's altitude relative to the others on screen */}
              <rect
                x={start.x + 2.4}
                y={start.y + 2.6 - band * 2.6}
                width="0.5"
                height={Math.max(0.4, band * 2.6)}
                fill={color}
                opacity="0.6"
              />

              <circle
                cx={start.x}
                cy={start.y}
                r="2.6"
                fill={color}
                fillOpacity="0.15"
                stroke={color}
                strokeWidth="0.4"
                className="cursor-pointer"
                data-cursor="graphic"
                onMouseEnter={() => setActive(f)}
                onMouseLeave={() => setActive((a) => (a?.id === f.id ? null : a))}
              />
              <circle cx={start.x} cy={start.y} r="0.9" fill={color} />
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3 rounded-lg border border-line/70 bg-panel/90 px-4 py-3 backdrop-blur-sm sm:left-3 sm:right-auto sm:w-72"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-ink">{active.callsign}</p>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                style={{ color: STATUS_COLOR[active.status], backgroundColor: `${STATUS_COLOR[active.status]}22` }}
              >
                {active.status}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">{active.operator} &middot; {active.aircraftType}</p>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px] text-ink-faint">
              <span>ALT {active.altitudeFt.toLocaleString()} ft</span>
              <span>SPD {active.speedKts} kts</span>
              <span>HDG {active.headingDeg}&deg;</span>
              <span>SEP {active.separationNm} nm</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
