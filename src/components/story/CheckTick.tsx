import { motion } from "framer-motion";

/** A small circle-to-checkmark animation (○ → ✓) marking that an important
 * research idea has been established — used sparingly, not as a generic
 * list bullet. */
export function CheckTick({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.circle
        cx="7.5"
        cy="7.5"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-accent-dim"
        variants={{ hidden: { pathLength: 0, opacity: 0.4 }, shown: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.5, delay }}
      />
      <motion.path
        d="M4.2 7.6 L6.4 9.8 L10.8 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.35, delay: delay + 0.4 }}
      />
    </motion.svg>
  );
}
