import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projectMeta } from "@/data/greeting";

/**
 * Two compact boarding-pass-styled notes — mine from the left, my
 * supervisor's from the right. Kept deliberately short: name, credentials,
 * and his single primary title up front, matching the scale of a real
 * physical note pinned to the page. The remaining academic standing
 * (programme advisory role, lab leadership, IEEE chair positions) is real
 * and preserved in full — just behind a small "Details" toggle rather than
 * forcing the note itself into a full biography block.
 */
export function StickyNotes() {
  return (
    <section className="relative bg-void px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-6">
        <BoardingPass side="left" code="RSCH" role="Researcher" name={projectMeta.author}>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-paper-ink-muted">
            {projectMeta.studentId}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-paper-ink-muted">
            {projectMeta.programme}
          </p>
        </BoardingPass>

        <BoardingPass
          side="right"
          code="SUPV"
          role={projectMeta.supervisorLabel}
          name={projectMeta.supervisorName}
          extraRoles={projectMeta.supervisorRoles.slice(1)}
        >
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-paper-ink-muted">
            {projectMeta.supervisorCredentials}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-paper-ink-muted">
            {projectMeta.supervisorRoles[0]}
          </p>
        </BoardingPass>
      </div>
    </section>
  );
}

interface PassProps {
  side: "left" | "right";
  code: string;
  role: string;
  name: string;
  children: React.ReactNode;
  extraRoles?: string[];
}

function BoardingPass({ side, code, role, name, children, extraRoles }: PassProps) {
  const [open, setOpen] = useState(false);
  const fromX = side === "left" ? -30 : 30;
  const baseRotate = side === "left" ? -3 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, x: fromX, rotate: baseRotate * 2 }}
      whileInView={{ opacity: 1, y: 0, x: 0, rotate: baseRotate }}
      whileHover={{ rotate: 0, y: -6, scale: 1.015 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky-note ${side === "left" ? "justify-self-start" : "justify-self-end"} w-full max-w-xs overflow-hidden`}
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-ink-muted/70">
          {role}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent-dim">
          {code}&middot;01
        </p>
      </div>

      <div className="px-6 pb-5 pt-2.5">
        <p className="font-display text-xl text-paper-ink">{name}</p>
        {children}

        {extraRoles && extraRoles.length > 0 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              data-cursor="hover"
              className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-dim transition-colors hover:text-accent"
            >
              {open ? "Hide details" : "Details"}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2.5 space-y-1.5 overflow-hidden"
                >
                  {extraRoles.map((r, i) => (
                    <li key={i} className="text-xs leading-relaxed text-paper-ink-muted/80">
                      {r}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="boarding-tear mx-6" />

      <div className="flex items-center justify-between px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-ink-muted/60">
        <span>Middlesex University Dubai</span>
        <span className="tracking-[0.3em] text-paper-ink-muted/40">▍▏▍▍▏▍</span>
      </div>
    </motion.div>
  );
}
