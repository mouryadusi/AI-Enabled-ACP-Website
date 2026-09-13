interface Props {
  id: string;
  className?: string;
}

/** Tiny, consistent motifs per rationale category — kept in the same
 * instrument/trajectory visual language as the rest of the site rather than
 * generic icon-pack glyphs. */
export function CategoryGlyph({ id, className }: Props) {
  const common = { width: 34, height: 34, viewBox: "0 0 34 34", fill: "none", className };

  switch (id) {
    case "visual":
      return (
        <svg {...common}>
          <rect x="7" y="9" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <rect x="10" y="6" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
        </svg>
      );
    case "interaction":
      return (
        <svg {...common}>
          <circle cx="17" cy="17" r="3" fill="currentColor" />
          <circle cx="17" cy="17" r="9" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <circle cx="17" cy="17" r="13" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
        </svg>
      );
    case "motion":
      return (
        <svg {...common}>
          <path d="M6 24 C 14 24, 18 10, 28 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="10" r="1.8" fill="currentColor" />
        </svg>
      );
    case "typography":
      return (
        <svg {...common}>
          <text x="5" y="24" fontFamily="Fraunces, serif" fontSize="18" fill="currentColor">A</text>
          <text x="18" y="24" fontFamily="IBM Plex Mono, monospace" fontSize="14" fill="currentColor" opacity="0.5">a</text>
        </svg>
      );
    case "colour":
      return (
        <svg {...common}>
          <circle cx="12" cy="17" r="7" fill="currentColor" opacity="0.85" />
          <circle cx="21" cy="17" r="7" fill="currentColor" opacity="0.35" />
        </svg>
      );
    case "spatial":
      return (
        <svg {...common}>
          <path
            d="M17 5 L28 11 L28 23 L17 29 L6 23 L6 11 Z M17 5 L17 17 M17 17 L28 11 M17 17 L6 11 M17 17 L17 29"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
        </svg>
      );
    default:
      return null;
  }
}
