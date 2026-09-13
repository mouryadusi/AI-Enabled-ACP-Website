import { motion } from "framer-motion";

/**
 * A minimal, original aircraft glyph (not modelled on any manufacturer's
 * logo or livery) — a single stroke silhouette, low and level, suited to a
 * ground-taxi animation rather than a dramatic aerial pass.
 */
export function RunwayAircraft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 34 L86 30 L124 6 L134 6 L120 30 L168 30 L184 22 L192 22 L182 34 L192 38 L184 38 L168 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M86 30 L74 46 L84 46 L100 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="6" cy="34" r="2.4" fill="currentColor" />
      {/* beacon light, strobing */}
      <motion.circle
        cx="130"
        cy="6"
        r="1.6"
        fill="#FF5C4D"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * Layered runway lighting: white edge lights (existing), a green threshold
 * row at the very base, a soft warm ground-haze glow behind everything, and
 * heavier blur/glow on each light so they read as illuminating the scene
 * rather than flat dots — the closest a CSS/SVG scene gets to a graded,
 * cinematic runway without a real lighting engine.
 */
export function RunwayLights() {
  const dots = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[10%] flex flex-col items-center">
      {/* ground haze */}
      <div
        className="absolute bottom-0 h-40 w-[90%] max-w-4xl rounded-[100%] opacity-40 blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, rgb(var(--c-accent) / 0.25), transparent 70%)" }}
      />

      <div className="relative h-px w-[86%] max-w-3xl">
        {dots.map((_, i) => {
          const t = i / (dots.length - 1);
          const spread = 1 - Math.abs(t - 0.5) * 0.7;
          return (
            <motion.span
              key={`l-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
              className="absolute top-[-40px] h-1 w-1 rounded-full bg-accent shadow-[0_0_10px_3px_rgba(74,214,199,0.55)]"
              style={{ left: `${t * 100}%`, transform: `translateY(${-spread * 40}px)` }}
            />
          );
        })}
        {dots.map((_, i) => {
          const t = i / (dots.length - 1);
          const spread = 1 - Math.abs(t - 0.5) * 0.7;
          return (
            <motion.span
              key={`r-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.06 + 0.1, ease: "easeInOut" }}
              className="absolute top-[40px] h-1 w-1 rounded-full bg-accent shadow-[0_0_10px_3px_rgba(74,214,199,0.55)]"
              style={{ left: `${t * 100}%`, transform: `translateY(${spread * 40}px)` }}
            />
          );
        })}
      </div>

      {/* threshold lights — green, right at the base, denser and steadier */}
      <div className="relative mt-2 h-px w-[70%] max-w-2xl">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={`th-${i}`}
            className="absolute h-[3px] w-[3px] rounded-full bg-signal-safe shadow-[0_0_8px_2px_rgba(63,222,143,0.6)]"
            style={{ left: `${(i / 9) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
