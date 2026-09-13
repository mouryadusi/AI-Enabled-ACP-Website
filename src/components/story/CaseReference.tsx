import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { incidentCases } from "@/data/incidents";
import { playTick } from "@/lib/sound";
import { PageFlipLink } from "@/components/transition/PageFlipLink";

/**
 * Brief case references by default — original summaries, not reproduced
 * news text — with a quick inline "Read more" per case for a sentence-level
 * expansion, and a separate "Read the full motivation" link into a genuine
 * full-page editorial essay (/motivation) for readers who want the whole
 * argument, not just the case data.
 */
export function CaseReference() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mt-8 border-t border-paper-ink/10 pt-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-ink-muted/60">
          Case reference &middot; public record
        </p>
        <PageFlipLink
          to="/motivation"
          tint="slate"
          onClick={() => playTick()}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-dim transition-colors hover:text-accent"
        >
          Read the full motivation &rarr;
        </PageFlipLink>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {incidentCases.map((c, i) => {
          const isOpen = openId === c.id;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="border-l-2 border-accent-dim/40 pl-4"
            >
              <p className="mt-1.5 font-display text-sm text-paper-ink">{c.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-paper-ink-muted">{c.summary}</p>
              <button
                onClick={() => setOpenId(isOpen ? null : c.id)}
                data-cursor="hover"
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-dim transition-colors hover:text-accent"
              >
                {isOpen ? "Show less" : "Read more"}
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {incidentCases
          .filter((c) => c.id === openId)
          .map((c) => (
            <motion.div
              key={c.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-1 gap-5 border-t border-paper-ink/10 pt-6 sm:grid-cols-2">
                <Field title="What happened" text={c.whatHappened} />
                <Field title="Operational context" text={c.context} />
                <Field title="Contributing factors" text={c.factors} />
                <Field title="Relevance to this research" text={c.relevance} />
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-dim">
                {c.status}
              </p>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

function Field({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-ink-muted/70">
        {title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-paper-ink-muted">{text}</p>
    </div>
  );
}
