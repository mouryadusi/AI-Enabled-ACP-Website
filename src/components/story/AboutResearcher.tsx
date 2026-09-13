import { motion } from "framer-motion";
import { projectMeta } from "@/data/greeting";

const BEATS = [
  {
    q: "Who I am",
    a: `${projectMeta.author}, an MSc Data Science and Artificial Intelligence student at ${projectMeta.institution}.`,
  },
  {
    q: "What I studied",
    a: "How aircraft interactions can be represented as graphs, and whether graph-based models can predict conflict risk earlier than feature-engineered baselines.",
  },
  {
    q: "Why I studied it",
    a: "A long-standing interest in aviation, sharpened into a specific research question by a real accident — covered honestly in this dissertation's Safety chapter.",
  },
  {
    q: "What I built",
    a: "A trained XGBoost baseline, a GCN, a GAT, and this interactive prototype demonstrating how their predictions could support — not replace — human decision-making.",
  },
  {
    q: "What I learned",
    a: "That the simplest model outperforming two more sophisticated ones is a genuine, reportable finding — not a failure to hide.",
  },
  {
    q: "Where it leads",
    a: "Toward real ADS-B data pipelines, better-calibrated uncertainty, and a decision-support tool an air traffic professional could actually trust.",
  },
];

/**
 * A proper researcher section, not a résumé: six short beats tracing why
 * this project exists and what it produced, closing with a real external
 * link to the researcher's own portfolio — styled and behaved like a
 * deliberate external link (new tab, explicit affordance), not a bare
 * underlined URL dropped into a paragraph.
 */
export function AboutResearcher() {
  return (
    <section className="relative border-t border-line/60 bg-void px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">About the Researcher</p>
        <h2 className="mt-2 font-display text-2xl text-ink lg:text-3xl">
          {projectMeta.author}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {BEATS.map((b, i) => (
            <motion.div
              key={b.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-dim">
                {b.q}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{b.a}</p>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="https://mouryadusi-github-io.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="nav"
          data-cursor-label="Open"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/20"
        >
          View research &amp; code
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 9 L9 3 M9 3 H4.5 M9 3 V7.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
