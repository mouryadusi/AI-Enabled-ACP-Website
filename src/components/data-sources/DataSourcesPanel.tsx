import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dataSources, toolStack } from "@/data/mission";

/** Light, paper-appropriate strip listing the surveillance/weather data
 * sources, with a click-to-expand panel underneath showing the full
 * research/engineering stack behind the dissertation — sits inside
 * Chapter 4's paper page rather than a dark glass panel, so it reads as
 * part of the document rather than a UI overlay. */
export function DataSourcesStrip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-paper-ink/10 pt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dataSources.map((s) => (
          <div key={s.name}>
            <p className="font-display text-sm text-paper-ink">{s.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-paper-ink-muted">{s.detail}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-dim transition-colors hover:text-accent"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="text-sm leading-none">
          +
        </motion.span>
        {open ? "Hide the full stack" : "Data & tools — expand for the full stack"}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {toolStack.map((group) => (
                <div key={group.category}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper-ink-muted/70">
                    {group.category}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-paper-ink-muted">
                    {group.tools.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
