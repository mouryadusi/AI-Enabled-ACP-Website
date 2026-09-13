import { mockFlights } from "@/data/mission";
import { cx } from "@/lib/utils";

const STATUS_DOT: Record<string, string> = {
  safe: "bg-signal-safe",
  caution: "bg-signal-caution",
  conflict: "bg-signal-conflict",
};

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function FlightSelector({ selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {mockFlights.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          data-cursor="hover"
          className={cx(
            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
            selectedId === f.id
              ? "border-radar/50 bg-radar/10"
              : "border-line/70 bg-panel-raised/40 hover:border-line",
          )}
        >
          <div>
            <p className="font-mono text-sm text-ink">{f.callsign}</p>
            <p className="text-xs text-ink-muted">
              {f.operator} · {f.aircraftType}
            </p>
          </div>
          <span className={cx("h-2.5 w-2.5 shrink-0 rounded-full", STATUS_DOT[f.status])} />
        </button>
      ))}
    </div>
  );
}
