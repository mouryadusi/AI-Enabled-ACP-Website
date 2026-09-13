import { Routes, Route } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";
import { RunwayScrollRail } from "@/components/layout/RunwayScrollRail";
import { NarrativeColourBar } from "@/components/layout/NarrativeColourBar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { RedGlowCursor } from "@/components/cursor/RedGlowCursor";
import { NarrativeEmbers } from "@/components/atmosphere/NarrativeEmbers";
import { ScrollWarpField } from "@/components/scrollwarp/ScrollWarpField";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";
import HomePage from "@/pages/HomePage";
import InspirationPage from "@/pages/InspirationPage";
import MotivationPage from "@/pages/MotivationPage";

/** Site-wide chrome (cursor, nav, scroll rail, footer) lives here and
 * persists across routes; only the routed page content changes below. */
export default function App() {
  return (
    <div className="relative min-h-screen">
      <ScrollWarpField />
      <RedGlowCursor />
      <CustomCursor />
      <NarrativeEmbers />
      <AccessibilityPanel />

      <NavBar />
      <NarrativeColourBar />
      <RunwayScrollRail />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/motivation" element={<MotivationPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
