const STAGES = [
  "ADS-B trajectories",
  "Aircraft states",
  "Graph construction",
  "GCN / GAT",
  "Interaction prediction",
  "Conflict probability",
];

/** The actual inference pipeline, stated plainly, so the simulator reads as
 * a frontend for a specific model architecture rather than a generic
 * "AI prediction" black box. */
export function PipelineStepper() {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
      {STAGES.map((stage, i) => (
        <span key={stage} className="flex items-center gap-2">
          <span className={i === STAGES.length - 1 ? "text-accent" : ""}>{stage}</span>
          {i < STAGES.length - 1 && <span className="text-ink-faint/40">&rarr;</span>}
        </span>
      ))}
    </div>
  );
}
