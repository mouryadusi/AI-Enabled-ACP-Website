import { motion } from "framer-motion";

interface Props {
  label: string;
  items: string[];
  payoff?: string;
  ink?: boolean; // true = render for light paper background
}

/**
 * A small instrument-style "system check" readout that runs its items in
 * sequence as it scrolls into view — each item sweeps through a brief scan
 * state before locking in. When every check has landed, an optional payoff
 * line lands the emotional point (used on the Safety chapter's full
 * checklist) rather than leaving the list to speak for itself. No numeric
 * progress counter — the ticking checkmarks already show progress; a
 * "3/7"-style count next to them would just be duplicated information.
 */
export function TestingSequence({ label, items, payoff, ink = true }: Props) {
  const stepDelay = 0.14;
  const totalDuration = 0.25 + items.length * stepDelay + 0.6;

  return (
    <div className="mt-8 max-w-sm">
      <p
        className={
          "font-mono text-[10px] uppercase tracking-[0.24em] " +
          (ink ? "text-paper-ink-muted/70" : "text-ink-faint")
        }
      >
        {label}
      </p>

      <ul className="mt-3 space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.4, delay: 0.25 + i * stepDelay }}
            className={
              "relative flex items-center gap-2.5 overflow-hidden font-mono text-xs " +
              (ink ? "text-paper-ink-muted" : "text-ink-muted")
            }
          >
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.3, delay: 0.25 + i * stepDelay + 0.35, ease: "backOut" }}
              className={
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] " +
                (ink ? "bg-accent/20 text-accent-dim" : "bg-accent/20 text-accent")
              }
            >
              ✓
            </motion.span>
            <span className="relative">
              {item}
              {/* brief scan sweep across the label just before it locks in */}
              <motion.span
                initial={{ x: "-100%" }}
                whileInView={{ x: "120%" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.35, delay: 0.25 + i * stepDelay, ease: "easeIn" }}
                className={"pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent to-accent/30"}
              />
            </span>
          </motion.li>
        ))}
      </ul>

      {payoff && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: totalDuration, duration: 0.6 }}
          className={
            "mt-4 border-t pt-3 font-display text-sm italic " +
            (ink ? "border-paper-ink/10 text-paper-ink" : "border-line/60 text-ink")
          }
        >
          {payoff}
        </motion.p>
      )}
    </div>
  );
}
