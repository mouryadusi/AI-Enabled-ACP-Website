import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const TINT_HEX: Record<string, string> = {
  ivory: "#F5EBD1",
  slate: "#DCE6F2",
  rose: "#F5DDD0",
  sky: "#D8E9F4",
  sage: "#DCEDDB",
  lavender: "#E6DEF2",
};

interface Props {
  to: string;
  tint?: keyof typeof TINT_HEX;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

/**
 * A "Read More" / "Know More" link that opens its destination the way a
 * physical page would: a coloured sheet lifts, rotates open around its
 * left edge under real 3D perspective, and only then does the route
 * change underneath it — not a plain `navigate()` fade. The overlay stays
 * a beat longer than the navigation to mask the route swap, so the
 * destination page is already in place by the time the "page" finishes
 * opening away from the viewer.
 */
export function PageFlipLink({ to, tint = "ivory", className, children, onClick }: Props) {
  const navigate = useNavigate();
  const [flipping, setFlipping] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (flipping) return;
    onClick?.();
    setFlipping(true);
    setTimeout(() => navigate(to), 420);
    setTimeout(() => setFlipping(false), 900);
  }

  return (
    <>
      <a href={to} onClick={handleClick} data-cursor="nav" className={className}>
        {children}
      </a>

      <AnimatePresence>
        {flipping && (
          <div
            className="pointer-events-none fixed inset-0 z-[110]"
            style={{ perspective: "1800px" }}
          >
            <motion.div
              initial={{ rotateY: 0, opacity: 1 }}
              animate={{ rotateY: -110, opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.61, 0.06, 0.4, 0.97] }}
              style={{
                transformOrigin: "left center",
                backgroundColor: TINT_HEX[tint],
                boxShadow: "12px 0 40px rgba(0,0,0,0.35)",
              }}
              className="absolute inset-0"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
