import { useState } from "react";

// adsb.fi runs a free, public, open (tar1090-based) live global aircraft
// map built on ADS-B Exchange community data — no account, no API key, no
// paid business agreement required, unlike FlightRadar24's official API.
// Centred near Dubai/UAE to match this dissertation's institutional
// context. This is real live traffic, not simulated data.
const LIVE_MAP_URL = "https://globe.adsb.fi/?lat=25.2532&lon=55.3657&zoom=6";

/**
 * Replaces the earlier mock "Global Flight Conflict Monitor" with an
 * embedded legitimate live flight tracker. If the embed is blocked by the
 * host's frame policy, a visible fallback link is shown instead of a blank
 * or silently broken panel — this is real third-party infrastructure this
 * project doesn't control, so a graceful degradation path is required.
 */
export function LiveFlightMonitor() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow">Live Airspace</p>
        <h2 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
          Real air traffic, right now
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted lg:text-base">
          This is a live public feed from{" "}
          <a
            href="https://adsb.fi"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="nav"
            className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            adsb.fi
          </a>
          , built on ADS-B Exchange community data — real aircraft, not a
          simulation. It is a live traffic view, not this project's own
          conflict-prediction output; the simulator further down this page
          is where the actual model runs, on labelled research data.
        </p>
      </div>

      <div className="relative h-[480px] overflow-hidden rounded-2xl border border-line/70 bg-panel/60 sm:h-[560px] lg:h-[640px]">
        {!failed ? (
          <iframe
            title="Live global air traffic (adsb.fi)"
            src={LIVE_MAP_URL}
            className="h-full w-full border-0"
            loading="lazy"
            onError={() => setFailed(true)}
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-faint">
              This browser/host blocked the embedded map
            </p>
            <a
              href={LIVE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="nav"
              className="rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/20"
            >
              Open live traffic in a new tab
            </a>
          </div>
        )}
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-line/60 bg-panel/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">
          Live &middot; adsb.fi
        </div>
      </div>
    </div>
  );
}
