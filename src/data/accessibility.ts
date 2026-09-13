/**
 * The 24 requested accessibility/personalization options, grouped by
 * category, each mapped to one or more real underlying effects (see
 * AccessibilityContext.ts). Several options share a mechanism honestly —
 * e.g. every colour-vision option activates the same safe-palette swap,
 * since building three separate daltonization matrices isn't something
 * that can be verified without a browser, and a safe, distinguishable
 * palette is the actually-recommended real-world fix regardless of type.
 * Nothing here changes a label without changing something real.
 */
export type A11yCategory = "vision" | "movement" | "cognitive" | "temporary";

export type A11yEffect =
  | "largeText"
  | "highContrast"
  | "dyslexiaFriendly"
  | "nightMode"
  | "colorSafePalette"
  | "warmFilter"
  | "grayscale"
  | "reducedMotion"
  | "reducedGlow"
  | "largeTargets"
  | "nativeCursor"
  | "calmMode";

export interface A11yOption {
  id: string;
  label: string;
  categories: A11yCategory[];
  effects: A11yEffect[];
  description: string;
}

export const a11yOptions: A11yOption[] = [
  { id: "dyslexia", label: "Dyslexia", categories: ["cognitive"], effects: ["dyslexiaFriendly"], description: "Wider letter/word spacing and increased line height." },
  { id: "visual-fatigue", label: "Visual fatigue", categories: ["vision", "temporary"], effects: ["warmFilter", "reducedGlow"], description: "Warmer tones, reduced glow and screen brightness." },
  { id: "night-mode", label: "Night mode", categories: ["vision", "temporary"], effects: ["nightMode"], description: "Forces the dark theme, darker background, lighter text." },
  { id: "green-blind", label: "Green colour blindness", categories: ["vision"], effects: ["colorSafePalette"], description: "Status colours swapped for a colour-safe, pattern-distinct palette." },
  { id: "red-blind", label: "Red colour blindness", categories: ["vision"], effects: ["colorSafePalette"], description: "Status colours swapped for a colour-safe, pattern-distinct palette." },
  { id: "blue-blind", label: "Blue colour blindness", categories: ["vision"], effects: ["colorSafePalette"], description: "Status colours swapped for a colour-safe, pattern-distinct palette." },
  { id: "senior", label: "Senior", categories: ["vision"], effects: ["largeText", "highContrast", "largeTargets"], description: "Larger text, stronger contrast, bigger click targets." },
  { id: "cataract", label: "Cataract", categories: ["vision"], effects: ["largeText", "highContrast"], description: "Larger text and stronger contrast." },
  { id: "visual-impairment", label: "Visual impairment", categories: ["vision"], effects: ["largeText", "highContrast"], description: "Larger text and stronger contrast." },
  { id: "imprecise-movements", label: "Imprecise movements", categories: ["movement"], effects: ["largeTargets", "nativeCursor"], description: "Bigger click targets and your system pointer instead of the custom one." },
  { id: "retinal-migraine", label: "Retinal migraine", categories: ["vision", "temporary"], effects: ["reducedMotion", "reducedGlow"], description: "Removes pulsing/strobing animation and glow effects." },
  { id: "parkinsons", label: "Parkinson's disease", categories: ["movement"], effects: ["largeTargets", "nativeCursor", "reducedMotion"], description: "Bigger targets, system pointer, calmer motion." },
  { id: "wilsons", label: "Wilson's disease", categories: ["movement", "cognitive"], effects: ["largeTargets", "reducedMotion"], description: "Bigger targets and calmer motion." },
  { id: "amd", label: "AMD", categories: ["vision"], effects: ["largeText", "highContrast"], description: "Larger text and stronger contrast for central-vision loss." },
  { id: "presbyopia", label: "Presbyopia", categories: ["vision"], effects: ["largeText"], description: "Larger text sizing throughout." },
  { id: "blue-light", label: "Blue light", categories: ["vision", "temporary"], effects: ["warmFilter"], description: "Warmer, lower blue-light colour temperature." },
  { id: "multiple-sclerosis", label: "Multiple sclerosis", categories: ["movement", "cognitive"], effects: ["reducedMotion", "largeTargets"], description: "Calmer motion and bigger click targets." },
  { id: "essential-tremor", label: "Essential tremor", categories: ["movement"], effects: ["largeTargets", "nativeCursor"], description: "Bigger click targets and your system pointer." },
  { id: "osteoarthritis", label: "Osteoarthritis", categories: ["movement"], effects: ["largeTargets"], description: "Bigger, easier-to-hit click targets." },
  { id: "achromatopsia", label: "Achromatopsia", categories: ["vision"], effects: ["grayscale", "highContrast"], description: "Full grayscale with boosted contrast." },
  { id: "photosensitive-epilepsy", label: "Photosensitive epilepsy", categories: ["vision", "temporary"], effects: ["reducedMotion", "reducedGlow"], description: "Removes flashing, pulsing and strobing effects entirely." },
  { id: "comfort", label: "Comfort", categories: ["cognitive", "temporary"], effects: ["calmMode", "reducedMotion"], description: "Fewer ambient effects, calmer overall motion." },
  { id: "low-vision", label: "Low vision", categories: ["vision"], effects: ["largeText", "highContrast"], description: "Larger text and stronger contrast." },
  { id: "attention-disorder", label: "Attention disorder", categories: ["cognitive"], effects: ["calmMode", "reducedMotion"], description: "Removes ambient/background motion that competes for attention." },
];

export const a11yCategories: { id: A11yCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vision", label: "Vision" },
  { id: "movement", label: "Movement" },
  { id: "cognitive", label: "Cognitive" },
  { id: "temporary", label: "Temporary" },
];
