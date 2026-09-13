import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { inspirationEntries } from "@/data/inspiration";
import { CategoryGlyph } from "@/components/inspiration/CategoryGlyph";

/**
 * The dedicated Inspiration page: not a references list, but the design
 * methodology behind the site — six principles, what each one means, and
 * where it shows up. Framed as part of the dissertation's own research
 * process (a UX rationale, same as any other methodology chapter) rather
 * than a credits page. Shows the first three principles directly, then a
 * "Read more" reveals the remaining ones — the same concise-then-expand
 * pattern used for every other chapter on the site, rather than dumping
 * all six at once.
 */
export default function InspirationPage() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? inspirationEntries : inspirationEntries.slice(0, 3);
  const remaining = inspirationEntries.length - visible.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-void px-6 pb-28 pt-32 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-radar/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">
        <Link
          to="/"
          data-cursor="hover"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-accent"
        >
          &larr; Back to the dissertation
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-8"
        >
          <p className="eyebrow">Design Rationale</p>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
            Why this site looks and moves the way it does
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted lg:text-lg">
            Every dissertation makes a hundred small design decisions before a
            single word is read — how information is organised, what earns
            motion, what stays still. This page documents the six principles
            behind this site's design, treated with the same rigour as any
            other methodology decision in the research itself.
          </p>
        </motion.div>

        <div className="mt-16 space-y-14">
          <AnimatePresence initial={false}>
            {visible.map((entry, i) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.6, delay: i < 3 ? i * 0.05 : 0 }}
                className="group grid grid-cols-1 gap-4 border-t border-line/60 pt-8 lg:grid-cols-12 lg:gap-8"
              >
                <div className="flex items-start gap-4 lg:col-span-3 lg:block">
                  <CategoryGlyph
                    id={entry.id}
                    className="h-8 w-8 shrink-0 text-ink-faint transition-colors duration-300 group-hover:text-accent"
                  />
                  <div>
                    <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-dim">
                      {entry.category}
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-9">
                  <h2 className="font-display text-xl text-ink lg:text-2xl">{entry.principle}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted lg:text-base">
                    {entry.rationale}
                  </p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                    See it in: {entry.whereToSee}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {!expanded && remaining > 0 && (
            <div className="border-t border-line/60 pt-8 text-center">
              <button
                onClick={() => setExpanded(true)}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
              >
                Read {remaining} more principle{remaining > 1 ? "s" : ""}
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 border-t border-line/60 pt-10 text-center"
        >
          <p className="font-display text-lg text-ink-muted">
            None of this replaces the research. It's the frame it sits in.
          </p>
          <Link
            to="/"
            data-cursor="hover"
            className="mt-6 inline-block rounded-full border border-accent/40 bg-accent/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
          >
            Return to the dissertation
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
