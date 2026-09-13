import { useEffect, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * The site's colour system doesn't just sit in CSS variables — it evolves
 * across the length of the page, tracking the dissertation's own narrative
 * arc: a dark aviation environment at the top, settling into a neutral
 * research register through the chapters, flaring toward alert red at the
 * conflict/risk content, cooling into the radar-cyan of the AI/prediction
 * tools, and resolving back to the site's own accent verdigris at the close.
 * This hook is the single source of truth for that arc — every component
 * that participates (the scroll rail, the top narrative bar, the ambient
 * embers) reads from here rather than inventing its own timing.
 */

const STOPS: { at: number; color: string }[] = [
  { at: 0.0, color: "#4AD6C7" }, // accent verdigris — opening
  { at: 0.22, color: "#8FA6B8" }, // neutral research slate — early chapters
  { at: 0.42, color: "#FF5C4D" }, // alert red — aircraft conflict / risk
  { at: 0.65, color: "#2FC2F0" }, // radar cyan — AI / models / prediction
  { at: 0.85, color: "#3FDE8F" }, // resolution green — live monitor / simulator
  { at: 1.0, color: "#4AD6C7" }, // accent verdigris — return
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bch = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bch})`;
}

export function narrativeColourAt(progress: number): string {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (progress >= a.at && progress <= b.at) {
      const t = (progress - a.at) / (b.at - a.at || 1);
      return mix(a.color, b.color, t);
    }
  }
  return STOPS[STOPS.length - 1].color;
}

export function useNarrativeColour() {
  const { progress } = useScrollProgress();
  const [color, setColor] = useState(() => narrativeColourAt(0));

  useEffect(() => {
    setColor(narrativeColourAt(progress));
  }, [progress]);

  return { color, progress };
}
