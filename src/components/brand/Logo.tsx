interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Original mark — not a literal aircraft. Two converging flight paths meet
 * at a single point (the moment of predicted conflict), with a short
 * dotted trajectory continuing past it — the prediction extending beyond
 * the observed paths. Reads as a monogram at small sizes, as a diagram at
 * large ones, which is the point: it's the whole thesis in one glyph.
 */
export function Logo({ className, size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 8 C 14 8, 22 16, 28 24"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 32 C 14 32, 22 24, 28 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M28 20 L34 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="1.5 3.5"
      />
      <circle cx="20" cy="20" r="2.6" fill="currentColor" />
      <circle cx="20" cy="20" r="6.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      {/* radar bearing ticks — a quiet nod to instrumentation, not noise */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r1 = 9.5;
        const r2 = 11;
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={20 + r1 * Math.cos(rad)}
            y1={20 + r1 * Math.sin(rad)}
            x2={20 + r2 * Math.cos(rad)}
            y2={20 + r2 * Math.sin(rad)}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.25"
          />
        );
      })}
    </svg>
  );
}
