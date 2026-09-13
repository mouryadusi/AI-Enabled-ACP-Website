import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollWarpScene } from "@/components/scrollwarp/ScrollWarpScene";
import { GlobeErrorBoundary } from "@/components/globe/GlobeErrorBoundary";

/**
 * A fixed, full-viewport, pointer-events-none WebGL layer sitting behind
 * all page content — the "the environment behaves like a flexible surface"
 * effect, driven by a real vertex shader (see ScrollWarpScene), not a CSS
 * transform standing in for one. Scoped deliberately to an ambient
 * background layer rather than warping actual text/DOM content, so a
 * shader issue can only ever affect a faint background glow, never break
 * page layout or readability. Falls back to nothing (a static background)
 * if WebGL can't initialise — no visible failure state, just an absence of
 * the ambient effect.
 */
export function ScrollWarpField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <GlobeErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <ScrollWarpScene />
          </Canvas>
        </Suspense>
      </GlobeErrorBoundary>
    </div>
  );
}
