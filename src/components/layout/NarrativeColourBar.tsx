import { useNarrativeColour, narrativeColourAt } from "@/hooks/useNarrativeColour";

/**
 * A thin fixed bar directly under the nav — the clearest, always-visible
 * expression of the site's evolving colour system. It doesn't just hold a
 * static accent: the gradient itself is sampled from the narrative colour
 * arc (verdigris → slate → alert red → radar cyan → resolution green → verdigris),
 * and a bright marker travels along it tracking exactly where the reader
 * is in that arc right now.
 */
export function NarrativeColourBar() {
  const { color, progress } = useNarrativeColour();
  const stops = Array.from({ length: 11 }, (_, i) => narrativeColourAt(i / 10)).join(", ");

  return (
    <div className="fixed left-0 right-0 top-0 z-40 h-[2px] w-full" aria-hidden="true">
      <div className="h-full w-full opacity-70" style={{ background: `linear-gradient(90deg, ${stops})` }} />
      <div
        className="absolute top-0 h-[2px] w-3 -translate-x-1/2 rounded-full blur-[1px] transition-[left] duration-150"
        style={{ left: `${progress * 100}%`, backgroundColor: color, boxShadow: `0 0 8px 2px ${color}` }}
      />
    </div>
  );
}
