import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface Props {
  text: string;
  className?: string;
}

/**
 * Text that activates as the reader's scroll position passes through it —
 * each word starts muted and sharpens to full ink colour in sequence, tied
 * directly to scroll progress rather than a fade-in/fade-out pair. Used
 * once, on the dissertation's core research-question sentence, so the
 * mechanic reads as emphasis on the single most important claim rather than
 * a stylistic tic applied everywhere.
 */
export function ReadingActivatedText({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "start 0.28"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} data-cursor="text" className={className}>
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          progress={scrollYProgress}
          start={i / words.length}
          end={(i + 1) / words.length}
        />
      ))}
    </p>
  );
}

function Word({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  // A travelling window, not a one-way ramp: the word is muted before the
  // reading position reaches it, sharpens as the position arrives, then
  // *returns* to muted once the position has moved past — otherwise, by
  // the time the reader has scrolled through the whole paragraph, every
  // word has permanently reached full emphasis and the paragraph reads as
  // uniformly bold/dark rather than as something being actively read.
  const span = Math.max(end - start, 0.001);
  const fadeIn = start;
  const peakIn = start + span * 0.35;
  const peakOut = end - span * 0.15;
  const fadeOut = Math.min(1, end + span * 1.4);

  const opacity = useTransform(
    progress,
    [fadeIn, peakIn, peakOut, fadeOut],
    [0.32, 1, 1, 0.32],
  );
  const color = useTransform(
    progress,
    [fadeIn, peakIn, peakOut, fadeOut],
    ["#8B8578", "#15161A", "#15161A", "#8B8578"],
  );

  return (
    <motion.span style={{ opacity, color }} className="mr-[0.28em]">
      {word}
    </motion.span>
  );
}
