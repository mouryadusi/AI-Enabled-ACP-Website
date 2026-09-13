import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { a11yOptions, type A11yEffect } from "@/data/accessibility";
import { useTheme } from "@/context/ThemeContext";

const STORAGE_KEY = "acp-accessibility";

interface AccessibilityContextValue {
  activeOptionIds: Set<string>;
  activeEffects: Set<A11yEffect>;
  hasEffect: (effect: A11yEffect) => boolean;
  toggleOption: (id: string) => void;
  reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function computeEffects(optionIds: Set<string>): Set<A11yEffect> {
  const effects = new Set<A11yEffect>();
  for (const opt of a11yOptions) {
    if (optionIds.has(opt.id)) opt.effects.forEach((e) => effects.add(e));
  }
  return effects;
}

/**
 * Drives every accessibility/personalization option from one place: each
 * active option contributes its real effects (see data/accessibility.ts) to
 * a combined effect set, which is applied as CSS classes on <html> — so a
 * single option toggle can genuinely change typography, motion, contrast,
 * colour, cursor and target sizing, not just its own label. Persisted to
 * localStorage. "Night mode" is wired directly into the existing theme
 * system rather than duplicating it.
 */
export function AccessibilityProvider({ children }: PropsWithChildren) {
  const [activeOptionIds, setActiveOptionIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const { theme, toggle } = useTheme();
  const activeEffects = useMemo(() => computeEffects(activeOptionIds), [activeOptionIds]);

  useEffect(() => {
    const doc = document.documentElement;
    // Maps each camelCase effect id to the kebab-case class name used in
    // index.css — kept explicit rather than a runtime string transform, so
    // the mapping is easy to audit against the actual CSS rules.
    const CLASS_FOR: Record<A11yEffect, string> = {
      largeText: "a11y-large-text",
      highContrast: "a11y-high-contrast",
      dyslexiaFriendly: "a11y-dyslexia-friendly",
      nightMode: "a11y-night-mode",
      colorSafePalette: "a11y-color-safe-palette",
      warmFilter: "a11y-warm-filter",
      grayscale: "a11y-grayscale",
      reducedMotion: "a11y-reduced-motion",
      reducedGlow: "a11y-reduced-glow",
      largeTargets: "a11y-large-targets",
      nativeCursor: "a11y-native-cursor",
      calmMode: "a11y-calm-mode",
    };
    (Object.keys(CLASS_FOR) as A11yEffect[]).forEach((effect) => {
      doc.classList.toggle(CLASS_FOR[effect], activeEffects.has(effect));
    });

    if (activeEffects.has("nightMode") && theme !== "dark") toggle();

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(activeOptionIds)));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEffects, activeOptionIds]);

  function toggleOption(id: string) {
    setActiveOptionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setActiveOptionIds(new Set());
  }

  return (
    <AccessibilityContext.Provider
      value={{
        activeOptionIds,
        activeEffects,
        hasEffect: (effect) => activeEffects.has(effect),
        toggleOption,
        reset,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
