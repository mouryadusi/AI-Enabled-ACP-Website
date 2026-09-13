import { useEffect, useRef, useState } from "react";

/**
 * A large, soft, diffused red glow that follows the cursor with a heavier
 * lag than the dot/ring — a separate atmospheric layer, not a cursor
 * replacement. No hard edge, no outline: a heavily blurred radial gradient
 * at low opacity, so it reads as ambient light in the environment rather
 * than a UI element. Sits behind the dot/ring cursor and above page
 * content. Disabled on touch devices, same as the main cursor.
 */
export function RedGlowCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsFinePointer) return;
    setActive(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }
    function tick() {
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed left-0 top-0 z-[95] h-[46vw] max-h-[560px] w-[46vw] max-w-[560px] rounded-full opacity-[0.16] blur-[90px] mix-blend-screen"
      style={{
        background: "radial-gradient(circle, #FF5C4D 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
