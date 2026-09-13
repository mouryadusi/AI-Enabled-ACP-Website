import { motion } from "framer-motion";

interface Props {
  title: string;
  className?: string;
}

// Small per-character jitter so the settle-in doesn't feel like a uniform
// machine sweep — each letter drops from a slightly different height, angle
// and delay, the way a hand-set title would never land in perfect unison.
function jitter(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Automatic, per-chapter cinematic title reveal, triggered by scroll
 * position rather than a click. Each character falls into place with its
 * own small rotation and timing offset. Letters are grouped per WORD in an
 * unbreakable inline-block, with a normal breakable space between words —
 * so the line still wraps at real word boundaries instead of splitting
 * mid-word, while each letter can still animate independently.
 */
export function ChapterTitleReveal({ title, className }: Props) {
  const words = title.split(" ");
  let globalIndex = 0;
  const parts: React.ReactNode[] = [];

  words.forEach((word, wi) => {
    const letters = word.split("");
    const startIndex = globalIndex;
    globalIndex += letters.length;

    parts.push(
      <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
        {letters.map((ch, li) => {
          const i = startIndex + li;
          const r = jitter(i + title.length);
          const rotate = (r - 0.5) * 22;
          const rise = 26 + r * 30;
          return (
            <span key={li} className="inline-block overflow-visible">
              <motion.span
                initial={{ y: rise, opacity: 0, rotate }}
                whileInView={{ y: 0, opacity: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.6,
                  delay: 0.012 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            </span>
          );
        })}
      </span>,
    );

    // A real, plain space rendered *between* word-spans (not inside the
    // nowrap wrapper) — this is what gives the browser an actual line-break
    // opportunity at word boundaries, same as ordinary text.
    if (wi < words.length - 1) parts.push(" ");
  });

  return (
    <h2 className={className} aria-label={title}>
      {parts}
    </h2>
  );
}
