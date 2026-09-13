import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GlobeScene } from "@/components/globe/GlobeScene";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { GlobeErrorBoundary } from "@/components/globe/GlobeErrorBoundary";
import { FlightStatusFallback } from "@/components/globe/FlightStatusFallback";
import { FlightMonitor } from "@/components/globe/FlightMonitor";
import { cx } from "@/lib/utils";

function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        Loading airspace…
      </p>
    </div>
  );
}

/**
 * "Global Flight Conflict Monitor" — an interactive 2D radar-style console
 * (FlightMonitor) is the default view: it always renders (pure SVG/DOM),
 * has real hover interaction with per-aircraft telemetry, and reads as an
 * AI monitoring instrument rather than a map. A 3D globe (React Three
 * Fiber) is offered as a secondary view for anyone who wants it, wrapped in
 * an ErrorBoundary that falls back to a 2D projection if WebGL fails.
 */
export function Globe3D() {
  const [mode, setMode] = useState<"monitor" | "globe">("monitor");

  return (
    <div id="globe" className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Live Airspace</p>
          <h2 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
            Global Flight Conflict Monitor
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-5 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal-safe" /> Safe
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal-caution" /> Caution
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal-conflict" /> Conflict
            </span>
          </div>
          <div className="flex rounded-full border border-line/70 p-0.5">
            {(["monitor", "globe"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                data-cursor="hover"
                className={cx(
                  "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
                  mode === m ? "bg-radar text-void" : "text-ink-muted hover:text-ink",
                )}
              >
                {m === "monitor" ? "Monitor" : "3D globe"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <GlassPanel data-cursor="3d" className="relative h-[420px] overflow-hidden p-3 sm:h-[520px] lg:h-[620px]">
        {mode === "monitor" ? (
          <FlightMonitor />
        ) : (
          <>
            <GlobeErrorBoundary fallback={<FlightStatusFallback />}>
              <Suspense fallback={<GlobeFallback />}>
                <Canvas
                  camera={{ position: [0, 0, 2.6], fov: 45 }}
                  dpr={[1, 1.75]}
                  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                  style={{ width: "100%", height: "100%", display: "block" }}
                  onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                >
                  <GlobeScene />
                  <OrbitControls
                    enablePan={false}
                    minDistance={1.6}
                    maxDistance={4}
                    autoRotate
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              </Suspense>
            </GlobeErrorBoundary>
            <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
              Drag to orbit &middot; scroll to zoom
            </div>
          </>
        )}
      </GlassPanel>
    </div>
  );
}
