import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Path {
  id: number;
  y: string;
  duration: number;
  delay: number;
  scale: number;
  opacity: number;
  reverse: boolean;
}

const PATHS: Path[] = [
  { id: 1, y: "18%", duration: 38, delay: 0, scale: 1, opacity: 0.16, reverse: false },
  { id: 2, y: "62%", duration: 46, delay: 6, scale: 0.75, opacity: 0.12, reverse: true },
  { id: 3, y: "38%", duration: 52, delay: 14, scale: 0.6, opacity: 0.1, reverse: false },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * A handful of small aircraft silhouettes drifting slowly through the
 * background — ambient, organic, continuous. Deliberately restrained: low
 * opacity, no glow, no telemetry attached to them, just distant traffic
 * moving through the airspace behind the actual content. Skipped entirely
 * under reduced motion rather than left static and half-drawn.
 */
export function AmbientAircraftField() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PATHS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-ink"
          style={{ top: p.y, opacity: p.opacity }}
          initial={{ x: p.reverse ? "110vw" : "-15vw" }}
          animate={{ x: p.reverse ? "-15vw" : "110vw" }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width={54 * p.scale}
            height={16 * p.scale}
            viewBox="0 0 54 16"
            fill="none"
            style={{ transform: p.reverse ? "scaleX(-1)" : undefined }}
          >
            <path
              d="M1 9 L23 8 L33 1.5 L36 1.5 L32 8 L45 8 L49 5.5 L51.5 5.5 L48.5 9 L51.5 12.5 L49 12.5 L45 10 L32 10 L36 16 L33 16 L23 10 L1 9 Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
