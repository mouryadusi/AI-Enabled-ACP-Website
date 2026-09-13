import { AnimatePresence, motion } from "framer-motion";
import type { Chapter } from "@/data/mission";
import { TestingSequence } from "@/components/chapters/TestingSequence";
import { ReadingActivatedText } from "@/components/story/ReadingActivatedText";
import { SafetyDiagram } from "@/components/story/SafetyDiagram";

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
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

/**
 * The "Read More" destination for every chapter: the full second
 * paragraph, the testing sequence, and any chapter-specific extras
 * (SafetyDiagram, CaseReference, DataSourcesStrip) live here — not on the
 * compact sticky page itself. This is a proper overlay (its own scroll
 * container), so it can hold as much detail as a chapter needs without the
 * sticky-stack page ever needing internal scrolling.
 */
export function ChapterDetailOverlay({ chapter, open, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[108] flex items-center justify-center bg-void/70 p-4 backdrop-blur-sm sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 text-paper-ink shadow-paper sm:p-10 ${TINT_BG[chapter.tint]}`}
          >
            <button
              onClick={onClose}
              data-cursor="hover"
              className="sticky top-0 float-right -mt-2 -mr-2 rounded-full border border-paper-ink/15 bg-paper-ivory/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-ink-muted"
            >
              Close
            </button>

            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-dim">
              {chapter.index} &middot; {chapter.kicker}
            </p>
            <h3 className="mt-2 font-display text-2xl text-paper-ink sm:text-3xl">
              {chapter.title}
            </h3>

            <div className="mt-6 space-y-4">
              {chapter.id === "safety" ? (
                <SafetyDiagram items={chapter.testing.items} />
              ) : null}
              <ReadingActivatedText
                text={chapter.body[1]}
                className="editorial-measure text-base leading-relaxed text-paper-ink-muted"
              />
            </div>

            {children}

            <div className="mt-6 border-t border-paper-ink/10 pt-6">
              <TestingSequence
                label={chapter.testing.label}
                items={chapter.testing.items}
                payoff={chapter.testing.payoff}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
