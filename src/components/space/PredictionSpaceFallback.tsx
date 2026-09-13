import { motion } from "framer-motion";

/** 2D fallback if WebGL can't initialise — the same idea (converging
 * trajectories, growing uncertainty, scattered data) rendered in plain SVG. */
export function PredictionSpaceFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 300 180" className="h-full w-full max-w-xl">
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 300}
            cy={Math.random() * 180}
            r="0.6"
            className="fill-radar/25"
          />
        ))}
        {[
          { d: "M20 40 Q120 60 150 90", c: "#2FC2F0" },
          { d: "M280 130 Q180 110 150 90", c: "#FF5C4D" },
          { d: "M30 150 Q110 120 150 90", c: "#3FDE8F" },
        ].map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.c}
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: i * 0.2 }}
          />
        ))}
        <circle cx="150" cy="90" r="6" fill="#FFB020" opacity="0.5" />
      </svg>
    </div>
  );
}
