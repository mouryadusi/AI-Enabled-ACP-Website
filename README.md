# AI-Enabled Aircraft Conflict Prediction

A premium, minimalistic, cinematic research showcase and interactive
decision-support prototype for an MSc Data Science & Artificial Intelligence
dissertation on predicting loss of aircraft separation before it happens.

- **Frontend** — React 18 + TypeScript + Vite, styled with Tailwind CSS,
  animated with Framer Motion, and rendering an interactive 3D globe with
  React Three Fiber / Drei. D3.js drives the model-comparison chart and
  conflict-probability gauge.
- **Backend** — FastAPI service exposing model inference endpoints for the
  three architectures evaluated in the dissertation (XGBoost, GCN, GAT).

```
aircraft-conflict-prediction/
├── src/
│   ├── components/
│   │   ├── intro/          GreetingIntro — multilingual greeting + runway
│   │   │                   landing + title/author/supervisor reveal
│   │   ├── cursor/          CustomCursor — dot + trailing ring, hover states
│   │   ├── layout/          NavBar, ProgressRail, Footer, GlassPanel
│   │   ├── hero/             StoryLead — quiet bridge into the story
│   │   ├── chapters/         PaperChapterList/PaperChapter — stacked
│   │   │                    "paper page" scroll narrative, one per chapter,
│   │   │                    with automatic ChapterTitleReveal and an
│   │   │                    aviation-themed TestingSequence readout
│   │   ├── data-sources/    OpenSky / ADS-B Exchange / ERA5 strip
│   │   ├── models/          D3 model comparison chart + model cards
│   │   ├── globe/            React Three Fiber 3D globe + flight arcs
│   │   ├── simulator/        Interactive conflict prediction simulator
│   ├── data/mission.ts       Chapter copy (incl. per-chapter paper tint and
│   │                         testing-sequence items), model results, mock flights
│   ├── data/greeting.ts      Multilingual greeting cycle + author/supervisor metadata
│   ├── lib/api.ts            Backend client (falls back to mock data)
│   └── lib/utils.ts
├── backend/                  FastAPI inference service (see backend/README.md)
├── tailwind.config.ts         Design tokens (colour, type, motion)
└── vercel.json
```

## Getting started

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL if running the backend
npm run dev                # http://localhost:5173
```

```bash
npm run build               # production build to /dist
npm run preview             # serve the production build locally
npm run typecheck           # strict TS check
```

To run the backend alongside it, see `backend/README.md` — the frontend
works standalone with bundled mock data if the backend isn't running.

## Design system

Two registers, one system: a quiet cinematic/editorial register for the
story, and a small functional accent kept strictly inside the interactive
prototype, where status colour carries real meaning.

- **Colour** — near-black void (`#08090B`) for the intro, chrome and the
  interactive "product" sections; five warm, unsaturated **paper tones**
  (one per chapter — ivory, slate, rose, sky, sage) for the story pages; a
  single muted champagne **accent** for editorial UI; a cyan "radar" accent
  plus a green/amber/red signal triad reserved for the globe and simulator,
  where those colours mean something operationally.
- **Type** — Fraunces (serif display) for chapter titles and the intro
  title block, Space Grotesk for UI headings, Inter for body copy, IBM Plex
  Mono for all data readouts, labels and the "instrument" voice.
- **Opening sequence** (`GreetingIntro`) — a multilingual greeting cycle,
  a dark runway scene with an original aircraft glyph landing (`RunwayAircraft`),
  then the dissertation title, author, student ID, programme and supervisor —
  dismissible by click, scroll, key press, or the Skip control.
- **Chapter pages** (`PaperChapter`) — each of the six dissertation chapters
  renders as a large sticky "paper" page in its own tint; as the reader
  scrolls, each page slides up and covers the last, gently scaling and
  dimming beneath it — the "turning pages of a research document" effect —
  with an automatic word-by-word `ChapterTitleReveal` and a small
  aviation-themed `TestingSequence` readout synced to each chapter's beat
  (e.g. Chapter 2's aircraft-systems checklist, Chapter 5's model-processing
  sequence).
- **Custom cursor** (`CustomCursor`) — a small dot plus a lagging ring that
  expands and labels itself over interactive elements (`data-cursor="hover"`);
  automatically disabled on touch/coarse-pointer devices.
- **Motion** — Framer Motion drives the intro, title reveals, the paper-page
  stack, and the simulator's state transitions; `prefers-reduced-motion` is
  respected globally (see `src/index.css`).

## Deployment

**Frontend → Vercel**
1. Push this repo to GitHub.
2. Import into Vercel — the included `vercel.json` sets the Vite build
   command and output directory automatically.
3. Add `VITE_API_BASE_URL` (and `VITE_CESIUM_ION_TOKEN` if you wire up
   Cesium) as a Vercel environment variable.

**Backend → Render or AWS** — see `backend/README.md` for both paths,
including the provided `Dockerfile` for containerized deployment.

## Extending toward production

- **Real model weights** — `backend/app/inference.py` and
  `backend/app/models/*.py` mark exactly where to load trained XGBoost /
  PyTorch Geometric artifacts in place of the bundled heuristic fallback.
- **Real terrain & imagery** — the default globe (React Three Fiber) needs
  no API key or install, and falls back to a dependency-free 2D SVG view
  (`src/components/globe/FlightStatusFallback.tsx`) if WebGL is unavailable,
  so it always renders something. For georeferenced terrain and satellite
  basemaps in a production deployment, swap in `resium` (React bindings for
  CesiumJS: `npm install cesium resium`, plus a free Cesium ion token) —
  both renderers read the same flight/prediction data
  (`src/data/mission.ts`, `src/lib/api.ts`), so the swap only touches
  presentation.
- **Live traffic** — replace the mock flights in `src/data/mission.ts` and
  `backend/main.py`'s `DEMO_FEATURES` with a live OpenSky Network / ADS-B
  Exchange feed.
