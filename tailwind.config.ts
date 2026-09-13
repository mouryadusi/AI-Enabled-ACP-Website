import type { Config } from "tailwindcss";

/**
 * Design tokens — v3.
 *
 * `void`, `panel`, `line`, `ink*` and `accent*` are wired to CSS custom
 * properties (see src/index.css) instead of fixed hex values, so a single
 * `.light` class on <html> re-themes the entire chrome/product register —
 * light and dark are each hand-tuned palettes, not an inverted filter.
 * `paper`, `radar` and `signal` stay fixed: the paper tones are already
 * bright in both modes (they're the "page" register), and radar/signal are
 * functional status colours that should mean the same thing regardless of
 * theme.
 */
function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: withOpacity("--c-void"),
        panel: withOpacity("--c-panel"),
        "panel-raised": withOpacity("--c-panel-raised"),
        line: withOpacity("--c-line"),
        ink: {
          DEFAULT: withOpacity("--c-ink"),
          muted: withOpacity("--c-ink-muted"),
          faint: withOpacity("--c-ink-faint"),
        },
        accent: {
          DEFAULT: withOpacity("--c-accent"),
          dim: withOpacity("--c-accent-dim"),
        },
        // Paper tones — one per chapter, warm-neutral, never saturated.
        paper: {
          ivory: "#F5EBD1",
          slate: "#DCE6F2",
          rose: "#F5DDD0",
          sky: "#D8E9F4",
          sage: "#DCEDDB",
          lavender: "#E6DEF2",
          ink: "#15161A",
          "ink-muted": "#5B5E64",
        },
        radar: {
          DEFAULT: "#2FC2F0",
          dim: "#1B6B85",
        },
        signal: {
          safe: "#3FDE8F",
          caution: "#FFB020",
          conflict: "#FF5C4D",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "'Space Grotesk'", "serif"],
        grotesk: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
        hand: ["'Caveat'", "cursive"],
      },
      backgroundImage: {
        vignette:
          "radial-gradient(ellipse at center, transparent 0%, rgb(var(--c-void)) 82%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgb(var(--c-shadow) / 0.45)",
        paper: "0 24px 64px rgb(var(--c-shadow) / 0.35)",
        glow: "0 0 40px rgba(201,168,118,0.18)",
        note: "0 18px 40px rgb(var(--c-shadow) / 0.22)",
      },
      keyframes: {
        blip: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.15" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blip: "blip 2.4s ease-in-out infinite",
        blink: "blink 1.6s ease-in-out infinite",
        scan: "scan 2.4s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
