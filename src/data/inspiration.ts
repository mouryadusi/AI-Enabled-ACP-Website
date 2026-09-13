/**
 * Design rationale for the site itself, organised the way a design
 * methodology chapter would be. Deliberately describes PRINCIPLES and how
 * they show up in this build — not named external sites — per an earlier,
 * more specific instruction in this project not to credit or reference
 * inspiration sources inside the shipped UI or code.
 */
export interface InspirationEntry {
  id: string;
  category: string;
  principle: string;
  rationale: string;
  whereToSee: string;
}

export const inspirationEntries: InspirationEntry[] = [
  {
    id: "visual",
    category: "Visual",
    principle: "Paper as a structural metaphor",
    rationale:
      "A dissertation is, at its core, a physical document — so the research narrative is built as large paper pages rather than website sections, each with its own tint, each stacking and rolling over the last as you scroll. The interactive prototype, by contrast, is built as an instrument panel: dark, precise, permanently lit like a cockpit display regardless of the site's light or dark setting.",
    whereToSee: "The six chapters, and the globe/simulator's fixed dark theme.",
  },
  {
    id: "interaction",
    category: "Interaction",
    principle: "Instruments, not menus",
    rationale:
      "Every interactive surface is framed as something you'd read off a real system — a radar scope, a departure board, a boarding pass, a checklist — rather than generic cards or buttons. The cursor itself expands to signal 'this responds to you' instead of relying on colour changes alone.",
    whereToSee: "The flight conflict monitor, the cursor, the boarding-pass researcher cards.",
  },
  {
    id: "motion",
    category: "Motion",
    principle: "Scroll as time, not a trigger",
    rationale:
      "Nothing on this site waits for a click to reveal itself. Chapter titles settle in as you arrive at them, the safety diagram draws itself, the title departs like a board settling on a flight — all driven by scroll position, because the reading experience should feel continuous rather than a series of button presses.",
    whereToSee: "Chapter title reveals, the opening sequence, the safety systems diagram.",
  },
  {
    id: "typography",
    category: "Typography",
    principle: "Two voices: narrative and instrument",
    rationale:
      "A serif display face carries the narrative voice — the researcher's own account of why this project exists. A monospace face carries every data readout, label and telemetry value, so the reader always knows, at a glance, whether they're reading a person or a system.",
    whereToSee: "Chapter body text (serif) versus the telemetry strip and simulator (mono).",
  },
  {
    id: "colour",
    category: "Colour",
    principle: "One accent, two registers",
    rationale:
      "A single verdigris-teal accent runs through the entire site, but it sits on two different backgrounds: warm, unsaturated paper tones for the human research narrative, and a near-black instrument palette for the interactive prediction tools. The split isn't decorative — it's the same distinction the dissertation itself draws between the researcher's account and the system being built.",
    whereToSee: "Compare any chapter page to the flight monitor or model comparison panel.",
  },
  {
    id: "spatial",
    category: "3D & Spatial",
    principle: "Dimensionality only where it explains something",
    rationale:
      "A 3D globe is offered, but it's a secondary view — the default is a flat, always-reliable radar console, because the point of this project is prediction, not rendering. Where depth is used (the stacked paper pages receding as you scroll past them), it's there to communicate sequence, not to show off.",
    whereToSee: "The Live Airspace section's Monitor/3D globe toggle.",
  },
];
