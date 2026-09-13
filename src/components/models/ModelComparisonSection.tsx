import { useState } from "react";
import { modelResults } from "@/data/mission";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelComparisonChart } from "@/components/models/ModelComparisonChart";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { cx } from "@/lib/utils";

export function ModelComparisonSection() {
  const [metric, setMetric] = useState<"f1" | "rocAuc">("f1");

  return (
    <div id="models" className="py-10 lg:py-14">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {modelResults.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>

      <GlassPanel className="mt-8 p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm text-ink">Metric comparison</p>
          <div className="flex rounded-full border border-line/70 p-0.5">
            {(["f1", "rocAuc"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={cx(
                  "rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors",
                  metric === m ? "bg-radar text-void" : "text-ink-muted hover:text-ink",
                )}
              >
                {m === "f1" ? "F1" : "ROC-AUC"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <ModelComparisonChart metric={metric} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          GAT's near-perfect ROC-AUC alongside a collapsed F1 score is a genuine finding:
          at this dataset scale, attention over sparse interaction graphs struggled to
          separate the minority conflict class even while ranking it well overall.
        </p>
      </GlassPanel>
    </div>
  );
}
