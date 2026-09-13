import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * A quiet parallax layer sitting behind the stacked paper pages, visible in
 * the void margins around them on wide screens — thin trajectory lines
 * drifting sideways at different speeds as the reader scrolls, each with a
 * small travelling marker. Not filler: it's the same "aircraft in shared
 * airspace" idea from Chapter 3, kept visibly present for the whole length
 * of the chapter stack rather than confined to one page.
 */
export function AmbientVectorField() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const lanes = [
    { top: "14%", speed: 1, dir: -1, colour: "text-radar/25" },
    { top: "34%", speed: 0.6, dir: 1, colour: "text-signal-safe/20" },
    { top: "58%", speed: 1.3, dir: -1, colour: "text-accent/25" },
    { top: "78%", speed: 0.8, dir: 1, colour: "text-signal-caution/20" },
  ];

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden xl:block">
      {lanes.map((lane, i) => (
        <Lane key={i} lane={lane} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Lane({
  lane,
  progress,
}: {
  lane: { top: string; speed: number; dir: number; colour: string };
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [0, 1], [0, lane.dir * 260 * lane.speed]);

  return (
    <motion.div className="absolute left-0 w-full" style={{ top: lane.top, x }}>
      <svg width="100%" height="24" viewBox="0 0 1400 24" preserveAspectRatio="none" className={lane.colour}>
        <line x1="0" y1="12" x2="1400" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" />
        <circle cx="60" cy="12" r="2.2" fill="currentColor" />
        <circle cx="540" cy="12" r="2.2" fill="currentColor" />
        <circle cx="1020" cy="12" r="2.2" fill="currentColor" />
      </svg>
    </motion.div>
  );
}
