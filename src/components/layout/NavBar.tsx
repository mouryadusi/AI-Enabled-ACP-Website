import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SoundToggle } from "@/components/layout/SoundToggle";

const sectionLinks = [
  { href: "#chapters", label: "Research" },
  { href: "#models", label: "Models" },
  { href: "#globe", label: "Airspace" },
  { href: "#simulator", label: "Simulator" },
];

/**
 * Persists across routes (rendered once in App.tsx). The in-page section
 * links only make sense on the homepage — they target ids that only exist
 * there — so they're hidden on other routes rather than silently doing
 * nothing; "Inspiration" is a real route link, reachable from anywhere.
 */
export function NavBar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mt-4 flex items-center justify-between rounded-full border border-line/70 bg-void/70 px-5 py-2.5 backdrop-blur-xl">
          <Link to="/" data-cursor="hover" className="flex items-center gap-2.5 text-accent">
            <Logo size={22} />
            <span className="hidden font-display text-sm font-medium tracking-wide text-ink sm:inline">
              Conflict Prediction
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {isHome &&
              sectionLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  data-cursor="nav"
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              ))}
            <Link
              to="/inspiration"
              data-cursor="nav"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-accent"
            >
              Inspiration
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SoundToggle />
            {isHome ? (
              <a
                href="#simulator"
                data-cursor="hover"
                data-cursor-label="Go"
                className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
              >
                Enter Simulator
              </a>
            ) : (
              <Link
                to="/"
                data-cursor="hover"
                className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/20"
              >
                Dissertation
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
