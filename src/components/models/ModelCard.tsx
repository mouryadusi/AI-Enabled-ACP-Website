import type { ModelResult } from "@/data/mission";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { cx } from "@/lib/utils";

const DOT: Record<string, string> = {
  xgboost: "bg-radar",
  gcn: "bg-signal-safe",
  gat: "bg-signal-caution",
};

export function ModelCard({ model }: { model: ModelResult }) {
  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-2.5">
        <span className={cx("h-2 w-2 rounded-full", DOT[model.id])} />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          {model.subtitle}
        </p>
      </div>
      <h3 className="mt-2 font-display text-xl text-ink">{model.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{model.description}</p>
      <div className="mt-5 flex gap-6 border-t border-line/60 pt-4">
        <div>
          <p className="font-display text-lg text-ink tabular-nums">
            {(model.f1 * 100).toFixed(2)}%
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">F1</p>
        </div>
        <div>
          <p className="font-display text-lg text-ink tabular-nums">{model.rocAuc.toFixed(3)}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
            ROC-AUC
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
