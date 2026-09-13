import { useState } from "react";
import { motion } from "framer-motion";
import { OpeningSequence } from "@/components/story/OpeningSequence";
import { StickyNotes } from "@/components/story/StickyNotes";
import { PaperChapterList } from "@/components/chapters/PaperChapterList";
import { PredictionSpace } from "@/components/space/PredictionSpace";
import { LiveFlightMonitor } from "@/components/globe/LiveFlightMonitor";
import { ConflictSimulator } from "@/components/simulator/ConflictSimulator";
import { GreetingIntro } from "@/components/intro/GreetingIntro";
import { InspirationSynopsis } from "@/components/story/InspirationSynopsis";
import { AboutResearcher } from "@/components/story/AboutResearcher";

/** The dissertation narrative — everything that used to live directly in
 * App.tsx, now scoped to the "/" route so the intro sequence only ever
 * plays here, not when visiting /inspiration directly. */
export default function HomePage() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <GreetingIntro onComplete={() => setIntroDone(true)} />}

      <OpeningSequence />
      <StickyNotes />
      <PaperChapterList />

      {/* Instrument sections stay dark in both site themes — like real
          cockpit/ATC displays, their colour coding means something and
          shouldn't invert with the reading theme. PredictionSpace joins
          them here rather than sitting outside: its particle/vector
          colours are calibrated for a dark backdrop. */}
      <div className="dark bg-void">
        <PredictionSpace />
        <LiveFlightMonitor />
        <ConflictSimulator />
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden border-t border-line/60 py-28 text-center"
      >
        <div className="absolute inset-0 bg-vignette" />
        <div className="relative mx-auto max-w-2xl px-6">
          <p className="eyebrow">From Data</p>
          <p className="mt-4 font-display text-2xl leading-relaxed text-ink lg:text-3xl">
            To intelligence. To predictive decision support — this began as a
            fascination with aviation, and became a question about how AI can
            help keep it safe.
          </p>
        </div>
      </motion.section>

      <InspirationSynopsis />
      <AboutResearcher />
    </>
  );
}
