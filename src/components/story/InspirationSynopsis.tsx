import { motion } from "framer-motion";
import { inspirationEntries } from "@/data/inspiration";
import { CheckTick } from "@/components/story/CheckTick";
import { playTick } from "@/lib/sound";
import { PageFlipLink } from "@/components/transition/PageFlipLink";

const BEATS = ["Noticed", "Investigated", "Applied"];

/** A compact synopsis on the home page — a short progressive-reveal beat
 * (noticed → investigated → applied) confirmed with a tick as each lands,
 * then three of the six principles, then a "Know More" into the full
 * design-rationale page rather than expanding inline. */
export function InspirationSynopsis() {
  const preview = inspirationEntries.slice(0, 3);

  return (
    <section className="relative border-t border-line/60 bg-void px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Design Rationale</p>
            <h2 className="mt-2 font-display text-2xl text-ink lg:text-3xl">
              Why this site looks and moves the way it does
            </h2>
          </div>
          <PageFlipLink
            to="/inspiration"
            tint="ivory"
            onClick={() => playTick()}
            className="group shrink-0 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-accent-dim"
          >
            Know more
            <CheckTick />
          </PageFlipLink>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {BEATS.map((beat, i) => (
            <motion.div
              key={beat}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.4, delay: i * 0.25 }}
              className="flex items-center gap-2"
            >
              <CheckTick delay={i * 0.25 + 0.1} />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                {beat}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {preview.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-dim">
                {entry.category}
              </p>
              <p className="mt-2 font-display text-base text-ink">{entry.principle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
