import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { incidentCases } from "@/data/incidents";

/**
 * The full-page continuation of the Safety chapter's motivation — the same
 * architectural pattern as InspirationPage (its own route, its own back
 * link, the chapter's paper tint carried through) rather than a modal.
 * Editorial prose first, the three researched case references after —
 * written to explain why prediction matters, not to dramatise tragedy.
 */
export default function MotivationPage() {
  return (
    <div className="relative min-h-screen bg-paper-slate px-6 pb-28 pt-32 text-paper-ink lg:px-10">
      <div className="relative mx-auto max-w-3xl">
        <Link
          to="/#safety"
          data-cursor="hover"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper-ink-muted/70 transition-colors hover:text-accent-dim"
        >
          &larr; Back to the dissertation
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-8"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-dim">
            Motivation
          </p>
          <h1 className="mt-3 font-display text-3xl text-paper-ink sm:text-4xl lg:text-5xl">
            Why prediction exists
          </h1>
        </motion.div>

        <div className="mt-10 space-y-6">
          <p className="editorial-measure text-base leading-relaxed text-paper-ink-muted lg:text-lg">
            Aviation is already extraordinarily safe. That is precisely why
            any single failure — mechanical, procedural, or a failure of
            situational awareness — draws such close, prolonged scrutiny:
            the baseline is so high that every deviation from it demands an
            explanation. This dissertation did not begin with a dataset. It
            began with a question that follows from that scrutiny: how much
            of a developing failure could, in principle, be visible before
            it resolves into an accident?
          </p>
          <p className="editorial-measure text-base leading-relaxed text-paper-ink-muted lg:text-lg">
            That question has a narrower, more technical form once you sit
            with it. Not every failure is a conflict-prediction problem —
            most aviation accidents involve a single aircraft, a mechanical
            system, a crew decision, none of which a model trained on
            aircraft-to-aircraft separation could plausibly speak to. Being
            precise about that boundary — what this research can and can't
            say something about — is itself part of taking the problem
            seriously.
          </p>
          <p className="editorial-measure text-base leading-relaxed text-paper-ink-muted lg:text-lg">
            The three cases below are not evidence that this dissertation's
            models would have prevented anything. They are here because
            each one, in a different way, sharpened the actual research
            question: what a loss of separation looks like before it
            happens (Tenerife); how quickly a safety-critical situation can
            unfold once it starts (Air India AI171); and how completely
            downstream analysis depends on the surveillance data holding up
            in the first place (Malaysia Airlines MH370) — which matters
            directly here, since this project's own data comes from the
            same category of source, ADS-B.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {incidentCases.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="border-t border-paper-ink/10 pt-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-ink-muted/60">
                Case {i + 1} of {incidentCases.length}
              </p>
              <h2 className="mt-2 font-display text-xl text-paper-ink lg:text-2xl">
                {c.label}
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field title="What happened" text={c.whatHappened} />
                <Field title="Operational context" text={c.context} />
                <Field title="Contributing factors" text={c.factors} />
                <Field title="Relevance to this research" text={c.relevance} />
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-dim">
                {c.status}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 border-t border-paper-ink/10 pt-10 text-center"
        >
          <p className="font-display text-lg text-paper-ink-muted">
            None of this replaces careful evaluation of what the models
            actually achieved. It's the reason the question was worth asking.
          </p>
          <Link
            to="/#safety"
            data-cursor="hover"
            className="mt-6 inline-block rounded-full border border-accent-dim/40 bg-accent/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-dim transition-colors hover:bg-accent/20"
          >
            Return to the dissertation
          </Link>
        </motion.div>
      </div>
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
