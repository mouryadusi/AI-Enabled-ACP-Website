import { Fragment } from "react";
import { chapters } from "@/data/mission";
import { PaperChapter } from "@/components/chapters/PaperChapter";
import { AmbientVectorField } from "@/components/chapters/AmbientVectorField";
import { ModelComparisonSection } from "@/components/models/ModelComparisonSection";
import { DataSourcesStrip } from "@/components/data-sources/DataSourcesPanel";
import { CaseReference } from "@/components/story/CaseReference";

/**
 * Renders the six dissertation chapters as stacked paper pages, in the
 * dissertation's own order. Immediately after Chapter 5 ("The Intelligence
 * Behind the Prediction") a full-bleed dark data panel with the live D3
 * model comparison breaks out of the paper metaphor — the story's evidence,
 * surfaced as a real product surface — before Chapter 6 resumes as paper and
 * hands off into the interactive globe and simulator.
 */
export function PaperChapterList() {
  return (
    <section id="chapters" className="relative">
      <AmbientVectorField />
      {chapters.map((chapter, i) => (
        <Fragment key={chapter.id}>
          <PaperChapter
            chapter={chapter}
            index={i}
            total={chapters.length}
            nextTints={[chapters[i + 1]?.tint, chapters[i + 2]?.tint].filter(
              (t): t is (typeof chapters)[number]["tint"] => Boolean(t),
            )}
          >
            {chapter.id === "data" && <DataSourcesStrip />}
            {chapter.id === "safety" && <CaseReference />}
          </PaperChapter>
          {chapter.id === "models" && (
            <div className="dark relative bg-void px-6 lg:px-10">
              <div className="mx-auto max-w-6xl">
                <ModelComparisonSection />
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </section>
  );
}
