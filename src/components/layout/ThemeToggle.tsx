import { useTheme } from "@/context/ThemeContext";

/** A small sun/moon switch, styled to sit inside the pill nav rather than
 * as a separate control — deliberately understated. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      data-cursor="hover"
      data-cursor-label={isLight ? "Dark" : "Light"}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line/70 text-ink-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {isLight ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" />
          </g>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
