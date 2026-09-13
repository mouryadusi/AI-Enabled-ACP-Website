import type { MockFlight } from "@/data/mission";

const STATUS_COLOR: Record<string, string> = {
  safe: "#3FDE8F",
  caution: "#FFB020",
  conflict: "#FF5C4D",
};

/** If WebGL can't initialise, fall back to the flight cards rather than a
 * blank selection screen — the same safety pattern used everywhere else
 * 3D is optional in this project. */
export function AircraftSelectorFallback({
  flights,
  selectedId,
  onSelect,
}: {
  flights: MockFlight[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
      {flights.map((f) => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          data-cursor="hover"
          className="flex items-center justify-between rounded-xl border border-line/60 bg-panel/50 px-4 py-3 text-left transition-colors hover:border-accent/50 hover:bg-panel/80"
        >
          <div>
            <p className="font-mono text-xs text-ink">{f.callsign}</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">
              {f.operator} &middot; {f.aircraftType}
            </p>
          </div>
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[f.status] }}
          />
        </button>
      ))}
    </div>
  );
}
