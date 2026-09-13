import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { thankYouCycle, projectMeta } from "@/data/greeting";
import { mockFlights, type MockFlight } from "@/data/mission";
import { RunwayAircraft, RunwayLights } from "@/components/intro/RunwayAircraft";
import { Logo } from "@/components/brand/Logo";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { playSelect, playStageComplete, playTakeoff } from "@/lib/sound";
import { AircraftSelectorFallback } from "@/components/aircraft3d/AircraftSelectorFallback";
import { AmbientAircraftField } from "@/components/intro/AmbientAircraftField";
import { CockpitHUD } from "@/components/intro/CockpitHUD";

type Stage = "select" | "confirmed" | "loading" | "title";

// Real project data — the same four mock flights used throughout the site
// (the simulator, the airspace monitor) — not invented flight-picker
// content. Only fields that actually exist on MockFlight are shown.
const FLIGHTS: MockFlight[] = mockFlights;

const STAGES = [
  { at: 0, label: "FUEL SYSTEM INITIALISING" },
  { at: 20, label: "NAVIGATION SYSTEM ONLINE" },
  { at: 40, label: "AIRSPACE SYNCHRONISING" },
  { at: 60, label: "PREDICTION ENGINE INITIALISING" },
  { at: 85, label: "FLIGHT READY" },
];

/**
 * The cinematic first-run sequence, now a real four-stage journey:
 *   select  — choose one of the project's own flights to "take off" with
 *   confirmed — a brief, deliberate confirmation beat
 *   loading — a staged systems-initialising ritual, 0→100%
 *   title   — the dissertation title settles in, then the site unlocks
 * The bottom "thank you" band and the runway/aircraft backdrop run
 * continuously underneath all four stages, so the environment always feels
 * alive rather than resetting between screens.
 */
export function GreetingIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const selected = FLIGHTS.find((f) => f.id === selectedId) ?? null;
  const stageLabel = [...STAGES].reverse().find((s) => progress >= s.at)?.label ?? STAGES[0].label;
  const lastStageRef = useRef("");

  function selectFlight(id: string) {
    if (stage !== "select") return;
    playSelect();
    setSelectedId(id);
    setStage("confirmed");
    setTimeout(() => setStage("loading"), 900);
  }

  // Loading ritual: 0 -> 100 over ~2.6s, only once we've entered that stage.
  useEffect(() => {
    if (stage !== "loading") return;
    const start = performance.now();
    const duration = 2600;
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(t * 100));
      raf = requestAnimationFrame(tick);
      if (t >= 1) {
        cancelAnimationFrame(raf);
        setTimeout(() => {
          playTakeoff();
          setStage("title");
        }, 500);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  // A soft chime each time the loading ritual crosses into a new named stage.
  useEffect(() => {
    if (stage !== "loading") return;
    if (stageLabel !== lastStageRef.current) {
      lastStageRef.current = stageLabel;
      playStageComplete();
    }
  }, [stageLabel, stage, lastStageRef]);

  // Thank-you cycle runs continuously regardless of stage.
  useEffect(() => {
    const t = setInterval(() => {
      setWordIndex((i) => (i + 1) % thankYouCycle.length);
    }, 1900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function dismiss() {
    if (stage !== "title" || exiting) return;
    setExiting(true);
    setTimeout(onComplete, 700);
  }

  function skip() {
    setExiting(true);
    setTimeout(onComplete, 400);
  }

  useEffect(() => {
    if (stage !== "title") return;
    window.addEventListener("keydown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const current = thankYouCycle[wordIndex];

  return (
    <motion.div
      initial={false}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onAnimationComplete={() => exiting && onComplete()}
      className="dark fixed inset-0 z-[90] flex flex-col bg-void"
      onClick={dismiss}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <AmbientAircraftField />
      <CockpitHUD />

      {/* Band 1 — mark */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center gap-2 pt-8 text-accent sm:pt-12"
      >
        <Logo size={24} />
        <div className="absolute right-6 top-1 sm:right-10" onClick={(e) => e.stopPropagation()}>
          <SoundToggle />
        </div>
      </motion.div>

      <div className="relative flex-1 overflow-hidden">
        {/* SELECT — choose a flight, presented as real 3D aircraft */}
        <AnimatePresence>
          {(stage === "select" || stage === "confirmed") && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 py-4"
            >
              <p className="font-display text-xl text-ink sm:text-2xl">Choose your flight</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                to take off
              </p>

              <div className="relative mt-6 w-full max-w-md">
                <AircraftSelectorFallback flights={FLIGHTS} selectedId={selectedId} onSelect={selectFlight} />
              </div>

              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1 flex flex-col items-center gap-1"
                  >
                    <p className="font-mono text-xs text-ink">
                      {selected.callsign} &middot; {selected.operator} &middot; {selected.aircraftType}
                    </p>
                    <p className="font-mono text-[10px] text-ink-faint">
                      {selected.altitudeFt.toLocaleString()} ft &middot; {selected.speedKts} kts
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
                Click an aircraft to select it
              </p>

              <AnimatePresence>
                {stage === "confirmed" && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-accent"
                  >
                    Flight selected &middot; {selected?.callsign}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOADING — the take-off ritual */}
        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
            >
              <div className="flex flex-col items-center gap-3 border border-line/50 px-8 py-6 sm:px-12">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                  Preparing {selected?.callsign} for takeoff
                </p>
                <span className="font-mono text-2xl tabular-nums text-ink sm:text-3xl">
                  {progress}
                  <span className="text-base text-ink-faint">%</span>
                </span>
                <div className="h-px w-40 overflow-hidden bg-line/60 sm:w-52">
                  <motion.div
                    className="h-full bg-accent"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stageLabel}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint"
                  >
                    {progress >= 100 ? "READY FOR TAKEOFF" : stageLabel}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TITLE */}
        <AnimatePresence>
          {stage === "title" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              <h1 className="max-w-2xl font-display text-2xl font-medium leading-tight text-ink sm:text-3xl lg:text-4xl">
                {projectMeta.title.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 14, letterSpacing: "0.3em", filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0em", filter: "blur(0px)" }}
                    transition={{ duration: 0.7, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }}
                    className="mr-[0.28em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted"
              >
                By {projectMeta.author} &middot; {projectMeta.programme}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1.2 }}
                className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
              >
                Click, scroll, or press any key to enter
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ground taxi strip — always present, the environment stays alive
            underneath every stage above it. */}
        <div className="absolute inset-x-0 bottom-0 h-[26%]">
          <RunwayLights />
          <motion.div
            initial={{ x: "-30vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-ink"
          >
            <RunwayAircraft className="h-5 w-20 sm:h-6 sm:w-24" />
          </motion.div>
        </div>
      </div>

      {/* Band 3 — pinned bottom strip */}
      <div className="relative flex shrink-0 items-center justify-center border-t border-line/50 py-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={current.lang}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2.5 font-display text-sm italic tracking-wide text-ink-muted"
          >
            <span className="font-mono text-[9px] not-italic tracking-[0.2em] text-ink-faint">
              {current.lang}
            </span>
            {current.text}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        data-cursor="hover"
        className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink-muted sm:right-10 sm:top-10"
      >
        Skip
      </button>
    </motion.div>
  );
}
