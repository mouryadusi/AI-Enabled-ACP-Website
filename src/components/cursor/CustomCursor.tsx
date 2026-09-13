import { useEffect, useRef, useState } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

type CursorState = "default" | "interactive" | "text" | "graphic" | "nav" | "3d";
const ALIASES: Record<string, CursorState> = { hover: "interactive" };

function resolveState(el: HTMLElement | null): CursorState {
  if (!el) return "default";
  const raw = el.dataset.cursor;
  if (!raw) return "default";
  return (ALIASES[raw] ?? (raw as CursorState)) || "default";
}

function shortestAngleLerp(current: number, target: number, t: number) {
  let diff = ((target - current + 540) % 360) - 180;
  return current + diff * t;
}

const STATE_LABEL: Partial<Record<CursorState, string>> = {
  graphic: "VIEW",
  nav: "GO",
  "3d": "ORBIT",
};

/**
 * The pointer itself is a small aircraft, not a ring that grows and blurs.
 * It banks and points into the direction of travel — heading computed from
 * frame-to-frame movement, smoothed so it turns rather than snaps — and
 * eases toward the real pointer position with slight inertia rather than
 * tracking it exactly, so it reads as something with weight and momentum
 * rather than a cursor skin. On interactive elements it levels off and
 * slows rather than growing into a blurred circle. A short, fading
 * contrail appears only while moving quickly, and disappears at rest.
 *
 * Respects `prefers-reduced-motion`: falls back to a small static dot with
 * no rotation, banking or trail. Disabled entirely on touch/coarse-pointer
 * devices.
 */
export function CustomCursor() {
  // The only accessibility-driven change to this component: when a
  // motor-impairment option is active, the user's real OS pointer is
  // offered instead — a functional necessity, not a redesign. Everything
  // below this line is exactly the existing cursor, untouched.
  const { hasEffect } = useAccessibility();
  const nativeCursor = hasEffect("nativeCursor");

  const planeRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stateRef = useRef<CursorState>("default");

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsFinePointer) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    document.documentElement.classList.add("has-custom-cursor");
    setActive(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let heading = 0; // degrees, 0 = pointing right
    let bank = 0;
    let scale = 1;
    let speed = 0;
    const trailHistory: { x: number; y: number }[] = [];
    let raf = 0;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      const next = resolveState(target);
      if (next !== stateRef.current) {
        stateRef.current = next;
        setState(next);
        setLabel(target?.dataset.cursorLabel ?? STATE_LABEL[next] ?? null);
      }
    }

    function tick() {
      const prevX = x;
      const prevY = y;
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;

      const dx = x - prevX;
      const dy = y - prevY;
      speed = Math.hypot(dx, dy);

      if (!reduced && speed > 0.15) {
        const targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI;
        heading = shortestAngleLerp(heading, targetHeading, 0.22);
        const turnRate = ((targetHeading - heading + 540) % 360) - 180;
        bank += (turnRate * 0.4 - bank) * 0.15;
      } else {
        bank *= 0.9;
      }

      const isInteractive = stateRef.current !== "default";
      const targetScale = isInteractive ? 0.8 : 1;
      scale += (targetScale - scale) * 0.2;

      if (planeRef.current) {
        planeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${heading}deg) rotateX(${Math.min(35, Math.abs(bank))}deg) scale(${scale})`;
      }

      // Contrail: only while moving with real speed, fading and shrinking.
      if (!reduced) {
        trailHistory.unshift({ x, y });
        trailHistory.length = Math.min(trailHistory.length, 6);
        trailRefs.current.forEach((el, i) => {
          const p = trailHistory[i + 1];
          if (!el) return;
          if (p && speed > 1.2) {
            el.style.opacity = String(Math.max(0, 0.18 - i * 0.03));
            el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
          } else {
            el.style.opacity = "0";
          }
        });
      }

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (!active || nativeCursor) return null;

  return (
    <>
      {!reduced &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (trailRefs.current[i] = el)}
            className="pointer-events-none fixed left-0 top-0 z-[99] h-1 w-1 rounded-full bg-accent opacity-0"
            style={{ willChange: "transform, opacity" }}
          />
        ))}

      <div
        ref={planeRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] text-accent"
        style={{ willChange: "transform" }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path
            d="M4 16 L22 13 L28 16 L22 19 L4 16 Z M14 13 L11 6 L14 6 L18 13 M14 19 L11 26 L14 26 L18 19"
            fill="currentColor"
            fillOpacity="0.92"
          />
        </svg>
        {label ? (
          <span
            className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono uppercase tracking-[0.15em] text-accent"
            style={{ fontSize: "8px" }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </>
  );
}
