import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * Restrained cockpit instrumentation for the greeting sequence: corner
 * brackets, a fine reference grid, a horizon arc, and live telemetry
 * (UTC clock, heading, drifting coordinates). Radar-cyan throughout, kept
 * visually distinct from the teal-verdigris accent used by the primary
 * greeting/title layer on top of it. A one-off boot sweep plays on mount,
 * skipped entirely under reduced motion.
 */
export function CockpitHUD() {
  const reducedMotion = useReducedMotion();
  const now = useClock();
  const [heading, setHeading] = useState(287);
  const [lat, setLat] = useState(25.2532);
  const [lng, setLng] = useState(55.3657);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setHeading((h) => Math.round((h + (Math.random() - 0.5) * 1.4 + 360) % 360));
      setLat((v) => v + (Math.random() - 0.5) * 0.004);
      setLng((v) => v + (Math.random() - 0.5) * 0.004);
    }, 1400);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const utc = now.toISOString().slice(11, 19);

  return (
    <div className="pointer-events-none absolute inset-0 select-none text-radar" aria-hidden="true">
      {!reducedMotion && (
        <motion.div
          initial={{ opacity: 0.55, top: "0%" }}
          animate={{ opacity: 0, top: "100%" }}
          transition={{ duration: 1.1, ease: "easeIn" }}
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-radar/25 to-transparent"
        />
      )}

      <div
        className="absolute inset-6 opacity-[0.07] sm:inset-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      <svg viewBox="0 0 400 200" className="absolute left-1/2 top-[54%] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 opacity-[0.16]" preserveAspectRatio="none">
        <path d="M0 130 Q 200 70 400 130" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M0 150 Q 200 100 400 150" stroke="currentColor" strokeWidth="0.6" fill="none" />
      </svg>

      {[
        "left-4 top-4 sm:left-7 sm:top-7 border-l border-t",
        "right-4 top-4 sm:right-7 sm:top-7 border-r border-t",
        "left-4 bottom-4 sm:left-7 sm:bottom-7 border-l border-b",
        "right-4 bottom-4 sm:right-7 sm:bottom-7 border-r border-b",
      ].map((pos, i) => (
        <div key={i} className={`absolute h-5 w-5 border-radar/50 sm:h-7 sm:w-7 ${pos}`} />
      ))}

      <div className="absolute left-4 top-12 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-radar/70 sm:left-8 sm:top-16 sm:block">
        <p>UTC {utc}</p>
        <p className="mt-0.5">HDG {String(heading).padStart(3, "0")}&deg;</p>
      </div>
      <div className="absolute right-4 top-12 hidden text-right font-mono text-[9px] uppercase tracking-[0.16em] text-radar/70 sm:right-8 sm:top-16 sm:block">
        <p>{lat.toFixed(4)}&deg;N</p>
        <p className="mt-0.5">{lng.toFixed(4)}&deg;E</p>
      </div>
      <div className="absolute bottom-12 left-4 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-radar/60 sm:bottom-16 sm:left-8 sm:block">
        AI-ACP &middot; FLIGHT DECK
      </div>
      <div className="absolute bottom-12 right-4 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-radar/60 sm:bottom-16 sm:right-8 sm:block">
        SYS NOMINAL
      </div>
    </div>
  );
}
