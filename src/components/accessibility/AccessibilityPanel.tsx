import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { a11yOptions, a11yCategories, type A11yCategory } from "@/data/accessibility";
import { useAccessibility } from "@/context/AccessibilityContext";
import { cx } from "@/lib/utils";

/**
 * A one-click accessibility/personalization panel: category filter, a full
 * option grid with real active/inactive state, and a reset. Every toggle
 * here drives a real CSS effect via AccessibilityContext — see
 * data/accessibility.ts for exactly which effect each option activates.
 */
export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<A11yCategory | "all">("all");
  const { activeOptionIds, toggleOption, reset } = useAccessibility();

  const filtered =
    category === "all" ? a11yOptions : a11yOptions.filter((o) => o.categories.includes(category));

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        aria-label="Accessibility and personalization settings"
        className="fixed bottom-5 right-5 z-[105] flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-panel/90 text-accent shadow-glass backdrop-blur-md transition-colors hover:bg-panel"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="8" r="1.4" fill="currentColor" />
          <path d="M12 11v6M9 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {activeOptionIds.size > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] text-void">
            {activeOptionIds.size}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[104] bg-void/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-20 right-5 z-[105] max-h-[70vh] w-[92vw] max-w-md overflow-y-auto rounded-2xl border border-line/70 bg-panel/95 p-5 shadow-glass backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-sm text-ink">Accessibility &amp; personalization</p>
                <button
                  onClick={reset}
                  data-cursor="hover"
                  className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint transition-colors hover:text-accent"
                >
                  Reset
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {a11yCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    data-cursor="hover"
                    className={cx(
                      "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                      category === c.id
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-line/70 text-ink-muted hover:text-ink",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filtered.map((opt) => {
                  const active = activeOptionIds.has(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      data-cursor="hover"
                      title={opt.description}
                      className={cx(
                        "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                        active
                          ? "border-accent/60 bg-accent/10"
                          : "border-line/60 bg-panel-raised/40 hover:border-line",
                      )}
                    >
                      <span className="text-xs text-ink">{opt.label}</span>
                      <span
                        className={cx(
                          "h-2 w-2 shrink-0 rounded-full",
                          active ? "bg-accent" : "bg-ink-faint/40",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
