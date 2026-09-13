import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNarrativeColour } from "@/hooks/useNarrativeColour";

interface Ember {
  left: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
}

/**
 * A handful of soft, slow-drifting glow points fixed across the viewport,
 * tinted with the same narrative colour as the scroll rail and top bar —
 * the third consumer of that shared colour arc. Deliberately faint: this
 * is ambience for otherwise-quiet stretches of the page, not a particle
 * effect competing for attention. Fixed positioning means it's visible
 * over both paper pages and dark instrument sections alike.
 */
export function NarrativeEmbers() {
  const { color } = useNarrativeColour();

  const embers = useMemo<Ember[]>(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        left: `${8 + ((i * 13) % 85)}%`,
        size: 2 + ((i * 7) % 4),
        duration: 14 + ((i * 5) % 10),
        delay: i * 1.3,
        driftX: i % 2 === 0 ? 18 : -18,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {embers.map((ember, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-[2px]"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            backgroundColor: color,
            boxShadow: `0 0 12px 2px ${color}`,
          }}
          initial={{ top: "110%", opacity: 0 }}
          animate={{
            top: ["110%", "-10%"],
            x: [0, ember.driftX, 0],
            opacity: [0, 0.35, 0.35, 0],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
