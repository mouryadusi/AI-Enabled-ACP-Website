import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { GlobeErrorBoundary } from "@/components/globe/GlobeErrorBoundary";
import { PredictionSpaceScene } from "@/components/space/PredictionSpaceScene";
import { PredictionSpaceFallback } from "@/components/space/PredictionSpaceFallback";

/**
 * A fully spatial, procedurally-animated 3D scene: aircraft trajectory
 * vectors drifting through space, each trailing a translucent cone that
 * grows the further along its predicted path it travels — encoding
 * "confidence falls as the prediction horizon extends" directly into the
 * geometry, not as decoration. A drifting camera responds subtly to the
 * pointer. This is the site's answer to an immersive 3D/spatial section:
 * genuinely procedural, genuinely about prediction and uncertainty, not a
 * spinning primitive dropped in for effect.
 */
export function PredictionSpace() {
  return (
    <section className="relative border-t border-line/60 bg-void px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Prediction Space</p>
          <h2 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
            What the model is actually looking at
          </h2>
          <p className="mt-4 text-ink-muted">
            Every trajectory the model evaluates carries a growing cone of
            uncertainty — the further into the future a position is
            predicted, the less confident that prediction can be. This space
            is that idea, rendered rather than described.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          data-cursor="3d"
          className="relative h-[380px] overflow-hidden rounded-2xl border border-line/60 bg-panel/40 sm:h-[460px] lg:h-[560px]"
        >
          <GlobeErrorBoundary fallback={<PredictionSpaceFallback />}>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 7], fov: 50 }}
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true }}
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                <PredictionSpaceScene />
              </Canvas>
            </Suspense>
          </GlobeErrorBoundary>
          <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
            Move your cursor &middot; the camera drifts with it
          </div>
        </motion.div>
      </div>
    </section>
  );
}
