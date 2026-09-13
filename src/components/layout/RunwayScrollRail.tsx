import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useNarrativeColour } from "@/hooks/useNarrativeColour";

/**
 * A fixed right-side "runway" standing in for the plain browser scrollbar:
 * a vertical track with runway-style tick marks and a small aircraft that
 * climbs as you scroll down (taking off) and descends as you scroll up
 * (landing), levelling off when scrolling pauses. Its colour is not fixed —
 * it reads from the same narrative colour arc as the top bar, so the
 * travelled-distance line and the aircraft itself shift through verdigris, alert
 * red, radar cyan and resolution green as the reader moves through the
 * story. Purely a visual/ambient indicator — the native scrollbar is
 * intentionally left in place underneath rather than hidden, so drag-to-
 * scroll and screen-reader scroll affordances still work for everyone.
 */
export function RunwayScrollRail() {
  const { progress, direction } = useScrollProgress();
  const { color } = useNarrativeColour();

  // 0 = grounded at the bottom, 1 = fully climbed at the top of the track.
  const climb = progress;
  const tilt = direction === "down" ? -22 : direction === "up" ? 22 : 0;

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative h-64 w-px bg-ink/10">
        {/* runway tick marks */}
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="absolute -left-1 h-px w-2 bg-ink/15"
            style={{ top: `${(i / 8) * 100}%` }}
          />
        ))}

        {/* travelled distance — coloured by narrative position */}
        <div
          className="absolute bottom-0 left-0 w-px transition-colors duration-500"
          style={{ height: `${climb * 100}%`, backgroundColor: color, boxShadow: `0 0 12px 1px ${color}` }}
        />

        {/* aircraft — climbs from the bottom (grounded) toward the top */}
        <div
          className="absolute -left-[7px] transition-transform duration-300 ease-out"
          style={{
            bottom: `${climb * 100}%`,
            transform: `translateY(50%) rotate(${tilt}deg)`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color }}>
            <path
              d="M12 2 L13.6 9 L21 12.5 L21 14.5 L13.6 13 L13.1 18.5 L15.5 20.5 L15.5 22 L12 21 L8.5 22 L8.5 20.5 L10.9 18.5 L10.4 13 L3 14.5 L3 12.5 L10.4 9 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <span
        className="mt-3 block text-center font-mono text-[10px] tracking-[0.2em] transition-colors duration-500"
        style={{ color }}
      >
        {String(Math.round(progress * 100)).padStart(3, "0")}%
      </span>
    </div>
  );
}
