import { motion } from "framer-motion";

/**
 * The animated bridge between the opening question and the title reveal:
 * two flight paths drawing in and converging on a single point — the
 * conflict moment the opening line asks about — which then pulses and
 * hands off to the departure-board title below. Not decoration: it's the
 * same visual idea as the logo, played out in motion.
 */
export function ConvergingTrajectories() {
  return (
    <svg viewBox="0 0 300 110" className="mx-auto h-24 w-full max-w-sm sm:h-28" aria-hidden="true">
      <motion.path
        d="M10 15 C 90 15, 170 70, 150 55"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        className="text-accent/70"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      />
      <motion.path
        d="M290 15 C 210 15, 130 70, 150 55"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        className="text-accent/70"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      />
      <motion.path
        d="M150 55 L150 95"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="1.5 4"
        className="text-ink-faint"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, delay: 1.1 }}
      />
      <motion.circle
        cx="150"
        cy="55"
        r="3"
        className="fill-accent"
        initial={{ scale: 0 }}
        whileInView={{ scale: [0, 1.8, 1] }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
      <motion.circle
        cx="150"
        cy="55"
        r="8"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
        className="text-accent"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0.6, 1.6], opacity: [0.6, 0] }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.4, delay: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
      />
    </svg>
  );
}
