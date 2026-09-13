import { motion } from "framer-motion";
import { mockFlights } from "@/data/mission";

const STATUS_COLOR: Record<string, string> = {
  safe: "#3FDE8F",
  caution: "#FFB020",
  conflict: "#FF5C4D",
};

const VB_W = 100;
const VB_H = 56;

// Simple equirectangular projection straight into the 100x56 viewBox:
// lng -180..180 -> x 0..100, lat 90..-90 -> y 0..56.
function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * VB_W, y: ((90 - lat) / 180) * VB_H };
}

/**
 * A dependency-free 2D projection of the same flight/risk data as the 3D
 * globe — plain SVG, no WebGL. Used as the guaranteed-visible fallback if
 * Three.js can't initialise, and doubles as a lighter-weight view on its
 * own merits (renders identically on every browser and device).
 */
export function FlightStatusFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-full w-full max-w-4xl"
        role="img"
        aria-label="Global flight traffic coloured by conflict risk"
      >
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="currentColor" strokeWidth="0.08" className="text-ink-faint/40" />
          </pattern>
        </defs>
        <rect width={VB_W} height={VB_H} fill="url(#grid)" />
        <ellipse cx={VB_W / 2} cy={VB_H / 2} rx="46" ry="24" fill="none" stroke="currentColor" strokeWidth="0.15" className="text-ink-faint/50" />

        {mockFlights.map((f, i) => {
          const start = project(f.originLat, f.originLng);
          const end = project(f.destLat, f.destLng);
          const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 6 };
          const color = STATUS_COLOR[f.status];
          const path = `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`;
          return (
            <g key={f.id}>
              <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="0.35"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: i * 0.15, ease: "easeOut" }}
              />
              <motion.circle
                cx={start.x}
                cy={start.y}
                r="0.9"
                fill={color}
                initial={{ scale: 0 }}
                whileInView={{ scale: [0, 1.4, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 + 1.2 }}
              />
              <text
                x={start.x + 1.4}
                y={start.y + 0.6}
                fontSize="1.6"
                fill={color}
                fontFamily="IBM Plex Mono, monospace"
                opacity="0.85"
              >
                {f.callsign}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
