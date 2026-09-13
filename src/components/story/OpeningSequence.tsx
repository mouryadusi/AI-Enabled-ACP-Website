import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projectMeta } from "@/data/greeting";
import { ConvergingTrajectories } from "@/components/story/ConvergingTrajectories";
import { TelemetryStrip } from "@/components/story/TelemetryStrip";

// Noise pool drawn from real destination names, so the scramble reads as an
// airport split-flap board settling, not random static.
const NOISE = "NEW YORK LONDON DUBAI TOKYO SINGAPORE PARIS SYDNEY DOHA".split("");
function randomChar() {
  return NOISE[Math.floor(Math.random() * NOISE.length)] || "A";
}

// The title is composed as two intentional rows, each grouped into whole
// words — never split mid-word, at any viewport, by construction rather
// than by hoping CSS wraps it well. This directly replaces the earlier
// single-line version that could orphan a letter.
const ROWS: string[][] = [["AI-ENABLED", "AIRCRAFT"], ["CONFLICT", "PREDICTION"]];

/**
 * The site's opening beat, as one continuous animated sequence rather than
 * disconnected sections: the research question states itself, two
 * trajectories converge to visualise it, that convergence hands off into
 * the dissertation title settling in like a departure board, and a live
 * telemetry strip carries the "research instrument" feeling straight into
 * the researcher/supervisor cards below — no dead gap anywhere in between.
 */
export function OpeningSequence() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const totalLetters = ROWS.flat().join("").length;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const maxFrame = 14 + totalLetters * 2.2;
    let f = 0;
    const id = setInterval(() => {
      f += 1;
      setFrame(f);
      if (f >= maxFrame) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [started, totalLetters]);

  let globalIndex = 0;

  return (
    <div id="top" className="relative flex flex-col items-center bg-void pb-16 pt-24 lg:pt-28">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
        className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-faint"
      >
        MSc Dissertation &middot; Middlesex University Dubai
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-6 max-w-xl px-6 text-center font-display text-xl leading-snug text-ink sm:text-2xl"
      >
        Three model architectures, evaluated on 72,841 real aircraft interaction
        graphs — and the simplest one won, which turned out to be the more
        interesting result.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.85 }}
        className="mt-2 max-w-lg px-6 text-center font-display text-xl italic leading-snug text-accent sm:text-2xl"
      >
        This is a study of how representing the aviation problem — not just modelling it — determines whether a machine can see risk coming.
      </motion.p>

      <ConvergingTrajectories />

      <div ref={titleRef} className="mt-2 flex flex-col items-center gap-1 px-4 sm:gap-2">
        {ROWS.map((row, ri) => (
          <h1
            key={ri}
            aria-label={row.join(" ")}
            className="flex flex-wrap items-center justify-center gap-x-[0.35em] font-mono text-xl font-medium uppercase tracking-[0.04em] text-ink sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {row.map((word, wi) => {
              const letters = word.split("");
              const wordStart = globalIndex;
              globalIndex += letters.length;
              return (
                <span key={wi} className="inline-flex whitespace-nowrap">
                  {letters.map((ch, li) => {
                    const i = wordStart + li;
                    const lockFrame = 14 + i * 2.2;
                    const locked = frame >= lockFrame;
                    const display = ch === "-" ? "-" : locked ? ch : randomChar();
                    return (
                      <span key={li} className={locked ? "text-accent/90" : "text-ink-faint"}>
                        {display}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h1>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="mt-8 w-full"
      >
        <TelemetryStrip />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="mt-12 h-9 w-px bg-gradient-to-b from-accent/60 to-transparent"
      />

      <p className="sr-only">{projectMeta.title}</p>
    </div>
  );
}
