import { motion } from "framer-motion";
import type { MockFlight } from "@/data/mission";

const RISK_LABEL = (w: number) => (w >= 0.5 ? "HIGH" : w >= 0.2 ? "MEDIUM" : "LOW");
const RISK_COLOR = (w: number) =>
  w >= 0.5 ? "text-signal-conflict" : w >= 0.2 ? "text-signal-caution" : "text-signal-safe";
const BAR_COLOR = (w: number) =>
  w >= 0.5 ? "bg-signal-conflict" : w >= 0.2 ? "bg-signal-caution" : "bg-signal-safe";

/**
 * The interaction graph the model actually reasons over: the selected
 * flight as target node A, its nearest neighbours as B/C/D, and the
 * attention weight each neighbour receives — i.e. how much that neighbour's
 * state influenced A's conflict probability. Making the highest-weight
 * relationship visually obvious is the point, not decoration.
 */
export function InteractionGraph({ flight }: { flight: MockFlight }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        Interaction graph &middot; attention weights
      </p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent bg-accent/10 font-mono text-xs text-accent">
          A
        </div>
        <div>
          <p className="font-mono text-xs text-ink">{flight.callsign}</p>
          <p className="font-mono text-[10px] text-ink-faint">Target node</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-l border-line/60 pl-5">
        {flight.neighbors.map((n, i) => (
          <div key={n.id} className="relative">
            <span className="absolute -left-[26px] top-1/2 h-px w-4 -translate-y-1/2 bg-line/60" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line/70 font-mono text-[10px] text-ink-muted">
                  {n.id}
                </span>
                <span className="font-mono text-[11px] text-ink-muted">Neighbour {n.id}</span>
              </div>
              <span className={"font-mono text-[10px] " + RISK_COLOR(n.weight)}>
                {n.weight.toFixed(2)} &middot; {RISK_LABEL(n.weight)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panel-raised">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${n.weight * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                className={"h-full rounded-full " + BAR_COLOR(n.weight)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
