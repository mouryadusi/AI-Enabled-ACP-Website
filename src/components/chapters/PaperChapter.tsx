import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Chapter } from "@/data/mission";
import { ChapterTitleReveal } from "@/components/chapters/ChapterTitleReveal";
import { ChapterDetailOverlay } from "@/components/chapters/ChapterDetailOverlay";
import { cx } from "@/lib/utils";

const TINT_BG: Record<Chapter["tint"], string> = {
  ivory: "bg-paper-ivory",
  slate: "bg-paper-slate",
  rose: "bg-paper-rose",
  sky: "bg-paper-sky",
  sage: "bg-paper-sage",
  lavender: "bg-paper-lavender",
};

interface Props {
  chapter: Chapter;
  index: number;
  total: number;
  /** Tints of the next one or two chapters, so this page can show a sliver
   * of them peeking out from behind it — the "papers stacked underneath"
   * depth cue, drawn from real upcoming chapter identities rather than
   * decorative filler. Kept deliberately subtle (small offset, low
   * opacity) so it reads as a preview, not competition for the active
   * chapter's content. */
  nextTints?: Chapter["tint"][];
  children?: React.ReactNode;
}

/**
 * One chapter, kept genuinely concise: numeral, kicker, title, tag, and
 * only the chapter's first (short) line — never the full body, never the
 * testing sequence, never chapter-specific extras. Everything past that
 * first line lives in ChapterDetailOverlay, opened by "Read More". This is
 * the fix for chapters needing internal scroll: there is no longer enough
 * content on the compact page itself to overflow.
 */
export function PaperChapter({ chapter, index, total, nextTints = [], children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const driftDir = index % 2 === 0 ? -1 : 1;
  const x = useTransform(scrollYProgress, [0, 1], [0, driftDir * 46]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const bankRotate = useTransform(scrollYProgress, [0, 1], [0, driftDir * -5]);
  const blurValue = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);
  const numeralY = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const isLast = index === total - 1;
  const tilt = (index % 2 === 0 ? -1 : 1) * (0.35 + (index % 3) * 0.12);
  const rotate = useTransform(bankRotate, (v) => v + tilt);

  // An editorial page-cut corner, alternating sides per chapter.
  const cut = 40;
  const cutClipPath =
    index % 2 === 0
      ? `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, 0 100%)`
      : `polygon(${cut}px 0, 100% 0, 100% 100%, 0 100%, 0 ${cut}px)`;

  return (
    <div
      ref={ref}
      id={chapter.id}
      className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-void p-5 sm:p-10 lg:p-14"
      style={{ zIndex: index + 1 }}
    >
      {/* Papers stacked underneath — small, subtle preview slivers, never
          competing with the active chapter for attention. */}
      {nextTints.map((tint, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute top-[14%] mx-auto h-[72%] w-[86%] max-w-[1160px]",
            TINT_BG[tint],
          )}
          style={{
            clipPath:
              index % 2 === 0
                ? `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, 0 100%)`
                : `polygon(${cut}px 0, 100% 0, 100% 100%, 0 100%, 0 ${cut}px)`,
            transform: `translate(${(i + 1) * 10}px, ${(i + 1) * 9}px) rotate(${(i + 1) * 1.1}deg) scale(${1 - (i + 1) * 0.03})`,
            opacity: 0.55 - i * 0.2,
            boxShadow: `0 ${8 + i * 4}px ${18 + i * 10}px rgb(var(--c-shadow) / ${0.22 - i * 0.06})`,
          }}
        />
      ))}

      <motion.div
        style={{
          ...(isLast ? { rotate: tilt } : { scale, opacity, rotate, x, y, filter }),
          clipPath: cutClipPath,
        }}
        className={cx(
          "paper-page relative mx-auto flex h-auto max-h-[90%] w-[96%] max-w-[1220px] flex-col justify-center text-paper-ink",
          TINT_BG[chapter.tint],
        )}
      >
        <span className="pointer-events-none absolute right-6 top-6 hidden max-w-[9rem] rotate-3 font-hand text-base text-paper-ink-muted/60 sm:right-10 sm:top-10 md:block">
          {chapter.marginalia}
        </span>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-center gap-6 px-6 py-12 sm:px-10 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-5">
            <motion.span
              style={{ y: numeralY }}
              className="inline-block font-mono text-sm text-paper-ink-muted/60"
            >
              {chapter.index} / {String(total).padStart(2, "0")}
            </motion.span>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.28em] text-accent-dim">
              {chapter.kicker}
            </p>
            <ChapterTitleReveal
              title={chapter.title}
              className="mt-3 font-display text-3xl font-medium leading-[1.05] text-paper-ink sm:text-4xl lg:text-5xl"
            />
            <p className="mt-4 max-w-xs font-mono text-xs text-paper-ink-muted">{chapter.tag}</p>
          </div>

          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="drop-cap editorial-measure text-base text-paper-ink-muted lg:text-lg"
            >
              {chapter.body[0]}
            </motion.p>

            <motion.button
              onClick={() => setDetailOpen(true)}
              data-cursor="hover"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-dim/40 bg-accent/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-dim transition-colors hover:bg-accent/20"
            >
              Read more
              <span aria-hidden="true">&rarr;</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <ChapterDetailOverlay chapter={chapter} open={detailOpen} onClose={() => setDetailOpen(false)}>
        {children}
      </ChapterDetailOverlay>
    </div>
  );
}
