import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, playTick } from "@/lib/sound";

/** An explicit, persistent SOUND ON / SOUND OFF control — nothing plays
 * until the visitor opts in here, and the choice is remembered across
 * visits via localStorage. */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isSoundEnabled());
  }, []);

  function toggle() {
    const next = !on;
    setSoundEnabled(next);
    setOn(next);
    if (next) playTick();
  }

  return (
    <button
      onClick={toggle}
      data-cursor="hover"
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-line/70 text-ink-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {on ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
          <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
          <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
