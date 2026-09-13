import { projectMeta } from "@/data/greeting";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-panel/40">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-ink">AI-Enabled Aircraft Conflict Prediction</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              An MSc Data Science &amp; Artificial Intelligence dissertation project —
              from trajectory data, to graph-based learning, to an interactive
              decision-support prototype.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
              {projectMeta.author} &middot; {projectMeta.studentId}
              <br />
              {projectMeta.programme}
              <br />
              {projectMeta.institution}
            </p>
          </div>
          <div>
            <p className="eyebrow">Data Sources</p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              <li>OpenSky Network</li>
              <li>ADS-B Exchange</li>
              <li>ERA5 Reanalysis (ECMWF)</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Models Evaluated</p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              <li>XGBoost — engineered features</li>
              <li>Graph Convolutional Network</li>
              <li>Graph Attention Network</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
