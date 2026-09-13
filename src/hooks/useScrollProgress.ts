import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "down" | "up" | "idle";

interface ScrollState {
  progress: number; // 0-1
  direction: ScrollDirection;
}

/**
 * Tracks overall page scroll progress (0-1) and current direction. Direction
 * settles back to "idle" a short beat after scrolling stops, so a resting
 * aircraft can level off instead of freezing mid-climb. Drives the runway
 * scroll rail and the story lead's ambient response to scrolling.
 */
export function useScrollProgress(): ScrollState {
  const [state, setState] = useState<ScrollState>({ progress: 0, direction: "idle" });
  const lastTop = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const progress = height > 0 ? scrollTop / height : 0;
      const direction: ScrollDirection =
        scrollTop > lastTop.current ? "down" : scrollTop < lastTop.current ? "up" : "idle";
      lastTop.current = scrollTop;

      setState({ progress, direction });

      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setState((s) => ({ ...s, direction: "idle" }));
      }, 260);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer.current);
    };
  }, []);

  return state;
}
