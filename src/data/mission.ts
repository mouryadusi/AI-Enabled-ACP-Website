/**
 * Content model for the research narrative and the prototype's mock data.
 * Chapter copy is adapted from the MSc dissertation film script. All flight
 * and prediction data below is synthetic / illustrative — swap the
 * `fetchConflictPrediction` call in `src/lib/api.ts` for the real FastAPI
 * backend in `/backend` to serve live model output.
 */

export type PaperTint = "ivory" | "slate" | "rose" | "sky" | "sage" | "lavender";

export interface Chapter {
  id: string;
  index: string; // real sequence — narrative order matters, hence numbering
  title: string;
  kicker: string;
  body: string[];
  tag: string;
  tint: PaperTint;
  /** A short aviation-themed "system check" sequence that animates in
   * alongside this chapter — echoes the story beat in instrument language. */
  testing: { label: string; items: string[]; payoff?: string };
  /** A brief, first-person margin note in a handwritten voice — the kind of
   * aside you'd actually scribble next to your own work, not site copy. */
  marginalia: string;
}

export const chapters: Chapter[] = [
  {
    id: "inspiration",
    index: "01",
    kicker: "Origin",
    title: "The Inspiration",
    tag: "Aviation as a lifelong fascination",
    tint: "ivory",
    body: [
      "A lifelong fascination with travel — not just the destinations, but everything that happens before arrival: the terminals, the boarding gates, the aircraft themselves.",
      "Built by human hands, designed to cross oceans, an aircraft is one of engineering's most quietly remarkable achievements. Millions of journeys begin because of it.",
    ],
    testing: {
      label: "Global route network scan",
      items: ["Airports indexed", "Routes mapped", "Aircraft tracked"],
    },
    marginalia: "started writing this on a delayed flight, appropriately",
  },
  {
    id: "safety",
    index: "02",
    kicker: "Motivation",
    title: "Aviation Safety",
    tag: "Layers of protection, and lessons learned",
    tint: "slate",
    body: [
      "Keeping an aircraft safely in the sky requires extraordinary layers of protection — engines, flight controls, navigation, communication, weather monitoring, structural integrity, and crew procedure, all working in concert.",
      "Aviation safety has also been shaped by hard-won lessons from experience. Every accident investigation asks the same underlying questions: how do we understand risk, and how can dangerous situations be identified earlier?",
    ],
    testing: {
      label: "Aircraft systems checking",
      items: [
        "Engine systems",
        "Flight controls",
        "Navigation",
        "Communication",
        "Weather monitoring",
        "Structural integrity",
        "Crew procedures",
      ],
      payoff: "Seven checks. Every single flight. Before you've even boarded.",
    },
    marginalia: "AI171 is the reason this dissertation exists, not a footnote",
  },
  {
    id: "conflict",
    index: "03",
    kicker: "The Problem",
    title: "Aircraft Conflict",
    tag: "Developing risk, not an accident",
    tint: "rose",
    body: [
      "Every aircraft follows its own trajectory while sharing the same airspace as hundreds of others, inside an environment that is constantly changing — weather, traffic density, airport operations.",
      "An aircraft conflict is a potential loss of safe separation identified from predicted movement. It is not an accident — it is developing risk. The challenge isn't only knowing where an aircraft is, but anticipating where its trajectory may take it.",
    ],
    testing: {
      label: "Flight trajectory analysis",
      items: ["Safe separation", "Reducing separation", "Potential conflict"],
    },
    marginalia: "the hardest part: risk isn't a position, it's a trend",
  },
  {
    id: "data",
    index: "04",
    kicker: "Foundation",
    title: "The Data",
    tag: "72,841 aircraft interaction graphs",
    tint: "sky",
    body: [
      "Aircraft surveillance data from the OpenSky Network and ADS-B Exchange, combined with ERA5 weather data, was transformed into flight trajectories and analysed for conflict-related features: horizontal distance, vertical separation, closing rate, TCPA and DCPA.",
      "Aircraft were not treated as isolated objects — their relationships became part of the learning problem, represented as interaction graphs with aircraft as nodes and interactions as edges.",
    ],
    testing: {
      label: "Surveillance data pipeline",
      items: ["Position", "Altitude", "Speed", "Heading", "Time"],
    },
    marginalia: "72,841 graphs later I finally stopped calling planes 'dots'",
  },
  {
    id: "models",
    index: "05",
    kicker: "Method",
    title: "The Intelligence Behind the Prediction",
    tag: "Representation matters more than complexity",
    tint: "sage",
    body: [
      "Three modelling strategies were evaluated: XGBoost learning from engineered interaction features, a Graph Convolutional Network learning from aircraft relationships, and a Graph Attention Network learning which relationships matter most.",
      "The comparison offered an important lesson — artificial intelligence isn't only about building more complex models. It's about representing the problem appropriately.",
    ],
    testing: {
      label: "AI model processing",
      items: ["XGBoost baseline", "Graph convolutional network", "Graph attention network"],
    },
    marginalia: "simplest model won — that surprised me more than it should have",
  },
  {
    id: "prototype",
    index: "06",
    kicker: "Application",
    title: "From Artificial Intelligence to Aviation Intelligence",
    tag: "A decision-support prototype, not a replacement",
    tint: "lavender",
    body: [
      "The final stage brought data, models and predictions together into an interactive decision-support prototype — explore it below.",
      "The objective is not to replace pilots or air traffic controllers. It's to investigate whether AI can surface useful predictive information earlier than today's workflows allow.",
    ],
    testing: {
      label: "Conflict detection analysis",
      items: ["Trajectory", "Aircraft interactions", "Separation parameters", "Conflict features"],
    },
    marginalia: "still just a prototype. treat every number here as provisional",
  },
];

export interface ModelResult {
  id: "xgboost" | "gcn" | "gat";
  name: string;
  subtitle: string;
  f1: number; // 0-1
  rocAuc: number; // 0-1
  description: string;
}

export const modelResults: ModelResult[] = [
  {
    id: "xgboost",
    name: "XGBoost",
    subtitle: "Engineered interaction features",
    f1: 0.9994,
    rocAuc: 1.0,
    description:
      "A strong conventional machine-learning baseline built directly on hand-engineered conflict features such as closing rate and TCPA/DCPA.",
  },
  {
    id: "gcn",
    name: "Graph Convolutional Network",
    subtitle: "Aircraft relationships as a graph",
    f1: 0.6898,
    rocAuc: 0.986,
    description:
      "Explores whether representing aircraft and their interactions as a graph — rather than a flat feature table — improves prediction.",
  },
  {
    id: "gat",
    name: "Graph Attention Network",
    subtitle: "Learned relationship weighting",
    f1: 0.0094,
    rocAuc: 0.942,
    description:
      "Adds attention over graph edges to learn which relationships matter most — high ROC-AUC but unstable F1 at this dataset scale, a genuine negative result worth reporting.",
  },
];

export interface ConflictFactor {
  label: string;
  value: number; // 0-1 contribution
}

export interface MockFlight {
  id: string;
  callsign: string;
  operator: string;
  aircraftType: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  altitudeFt: number;
  headingDeg: number;
  speedKts: number;
  nearbyTraffic: number;
  status: "safe" | "caution" | "conflict";
  riskLevel: "low" | "medium" | "high";
  neighbors: { id: string; weight: number }[];
  separationNm: number;
  verticalSeparationFt: number;
  closingRateKts: number;
  tcpaSeconds: number;
  dcpaNm: number;
  factors: ConflictFactor[];
}

export const mockFlights: MockFlight[] = [
  {
    id: "fl-1",
    callsign: "BAW117",
    operator: "British Airways",
    aircraftType: "A350-1000",
    originLat: 51.4700,
    originLng: -0.4543,
    destLat: 40.6413,
    destLng: -73.7781,
    altitudeFt: 37000,
    headingDeg: 284,
    speedKts: 488,
    nearbyTraffic: 6,
    status: "conflict",
    riskLevel: "high",
    neighbors: [
      { id: "B", weight: 0.71 },
      { id: "C", weight: 0.19 },
      { id: "D", weight: 0.10 },
    ],
    separationNm: 3.1,
    verticalSeparationFt: 800,
    closingRateKts: 612,
    tcpaSeconds: 94,
    dcpaNm: 1.8,
    factors: [
      { label: "Closing rate", value: 0.91 },
      { label: "Horizontal separation", value: 0.74 },
      { label: "Vertical separation", value: 0.68 },
      { label: "Time to closest approach", value: 0.83 },
      { label: "Aircraft movement pattern", value: 0.42 },
    ],
  },
  {
    id: "fl-2",
    callsign: "UAE9",
    operator: "Emirates",
    aircraftType: "A380-800",
    originLat: 25.2532,
    originLng: 55.3657,
    destLat: 51.4700,
    destLng: -0.4543,
    altitudeFt: 40000,
    headingDeg: 312,
    speedKts: 512,
    nearbyTraffic: 3,
    status: "caution",
    riskLevel: "medium",
    neighbors: [
      { id: "B", weight: 0.44 },
      { id: "C", weight: 0.31 },
      { id: "D", weight: 0.12 },
    ],
    separationNm: 6.4,
    verticalSeparationFt: 1400,
    closingRateKts: 340,
    tcpaSeconds: 210,
    dcpaNm: 4.2,
    factors: [
      { label: "Closing rate", value: 0.52 },
      { label: "Horizontal separation", value: 0.46 },
      { label: "Vertical separation", value: 0.31 },
      { label: "Time to closest approach", value: 0.49 },
      { label: "Aircraft movement pattern", value: 0.22 },
    ],
  },
  {
    id: "fl-3",
    callsign: "SIA322",
    operator: "Singapore Airlines",
    aircraftType: "B777-300ER",
    originLat: 1.3644,
    originLng: 103.9915,
    destLat: 35.5494,
    destLng: 139.7798,
    altitudeFt: 39000,
    headingDeg: 41,
    speedKts: 495,
    nearbyTraffic: 2,
    status: "safe",
    riskLevel: "low",
    neighbors: [
      { id: "B", weight: 0.09 },
      { id: "C", weight: 0.06 },
      { id: "D", weight: 0.04 },
    ],
    separationNm: 14.8,
    verticalSeparationFt: 3000,
    closingRateKts: 88,
    tcpaSeconds: 640,
    dcpaNm: 11.3,
    factors: [
      { label: "Closing rate", value: 0.14 },
      { label: "Horizontal separation", value: 0.09 },
      { label: "Vertical separation", value: 0.07 },
      { label: "Time to closest approach", value: 0.11 },
      { label: "Aircraft movement pattern", value: 0.08 },
    ],
  },
  {
    id: "fl-4",
    callsign: "DAL45",
    operator: "Delta Air Lines",
    aircraftType: "A330-900",
    originLat: 33.6407,
    originLng: -84.4277,
    destLat: 48.8566,
    destLng: 2.3522,
    altitudeFt: 36000,
    headingDeg: 58,
    speedKts: 470,
    nearbyTraffic: 4,
    status: "caution",
    riskLevel: "medium",
    neighbors: [
      { id: "B", weight: 0.44 },
      { id: "C", weight: 0.31 },
      { id: "D", weight: 0.12 },
    ],
    separationNm: 5.9,
    verticalSeparationFt: 1000,
    closingRateKts: 388,
    tcpaSeconds: 168,
    dcpaNm: 3.6,
    factors: [
      { label: "Closing rate", value: 0.61 },
      { label: "Horizontal separation", value: 0.53 },
      { label: "Vertical separation", value: 0.44 },
      { label: "Time to closest approach", value: 0.57 },
      { label: "Aircraft movement pattern", value: 0.26 },
    ],
  },
];

export const dataSources = [
  {
    name: "OpenSky Network",
    detail: "Historical and live ADS-B aircraft surveillance data",
  },
  {
    name: "ADS-B Exchange",
    detail: "Supplemental unfiltered aircraft surveillance data",
  },
  {
    name: "ERA5 Reanalysis",
    detail: "Atmospheric and weather context from ECMWF",
  },
];

export interface ToolCategory {
  category: string;
  tools: string[];
}

/** The full research/engineering stack behind the dissertation, shown in
 * Chapter 4's expandable "Data & Tools" panel. */
export const toolStack: ToolCategory[] = [
  {
    category: "Research & ML",
    tools: [
      "Python",
      "Jupyter Notebook",
      "Google Colab",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "XGBoost",
      "PyTorch",
      "PyTorch Geometric",
      "SHAP",
      "Matplotlib",
    ],
  },
  {
    category: "Data Sources",
    tools: ["OpenSky Network", "ADS-B Exchange", "ERA5 Weather Data"],
  },
  {
    category: "Backend & System Development",
    tools: ["FastAPI", "REST APIs", "PostgreSQL", "Docker", "GitHub", "Git"],
  },
  {
    category: "Frontend & Visualization",
    tools: ["React", "TypeScript", "Vite", "Tailwind CSS", "Three.js", "React Three Fiber", "D3.js", "CesiumJS"],
  },
  {
    category: "Development Environment",
    tools: ["VS Code", "Conda", "Virtual Environment", "npm", "Node.js"],
  },
];
