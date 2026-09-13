import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { modelResults } from "@/data/mission";

type Metric = "f1" | "rocAuc";

interface Props {
  metric: Metric;
}

const METRIC_LABEL: Record<Metric, string> = {
  f1: "F1 Score",
  rocAuc: "ROC-AUC",
};

const MODEL_COLOR: Record<string, string> = {
  xgboost: "#2FC2F0",
  gcn: "#3FDE8F",
  gat: "#FFB020",
};

/**
 * A D3-driven horizontal bar comparison of model performance. D3 owns the
 * scales/axes/measurement; React owns mount/unmount — the effect re-renders
 * the SVG whenever the selected metric changes.
 */
export function ModelComparisonChart({ metric }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const svgEl = ref.current;
    const container = containerRef.current;
    if (!svgEl || !container) return;

    const render = () => {
      const width = container.clientWidth;
      const height = 260;
      const margin = { top: 10, right: 56, bottom: 30, left: 168 };

      const svg = d3.select(svgEl);
      svg.selectAll("*").remove();
      svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", height);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
      const y = d3
        .scaleBand()
        .domain(modelResults.map((m) => m.name))
        .range([0, innerHeight])
        .padding(0.42);

      // gridlines
      g.append("g")
        .attr("class", "grid")
        .selectAll("line")
        .data(x.ticks(5))
        .join("line")
        .attr("x1", (d) => x(d))
        .attr("x2", (d) => x(d))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#1E2836")
        .attr("stroke-width", 1);

      const bars = g
        .selectAll(".bar")
        .data(modelResults, (d: any) => d.id)
        .join("g")
        .attr("class", "bar")
        .attr("transform", (d) => `translate(0,${y(d.name)})`);

      bars
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", y.bandwidth())
        .attr("rx", 6)
        .attr("fill", (d) => MODEL_COLOR[d.id])
        .attr("fill-opacity", 0.85)
        .attr("width", 0)
        .transition()
        .duration(900)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => x(d[metric]));

      bars
        .append("text")
        .attr("x", -14)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.32em")
        .attr("text-anchor", "end")
        .attr("fill", "#8B95A5")
        .attr("font-family", "IBM Plex Mono, monospace")
        .attr("font-size", 11)
        .text((d) => d.name);

      bars
        .append("text")
        .attr("x", (d) => x(d[metric]) + 10)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.32em")
        .attr("fill", "#E9EEF5")
        .attr("font-family", "IBM Plex Mono, monospace")
        .attr("font-size", 12)
        .attr("opacity", 0)
        .text((d) => (metric === "f1" ? `${(d[metric] * 100).toFixed(2)}%` : d[metric].toFixed(3)))
        .transition()
        .delay(500)
        .duration(400)
        .attr("opacity", 1);

      const xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0%"));
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .call((g) => g.select(".domain").attr("stroke", "#1E2836"))
        .selectAll("text")
        .attr("fill", "#4E5A6B")
        .attr("font-family", "IBM Plex Mono, monospace")
        .attr("font-size", 10);
      g.selectAll(".tick line").attr("stroke", "#1E2836");
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(container);
    return () => ro.disconnect();
  }, [metric]);

  return (
    <div ref={containerRef} className="w-full">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        {METRIC_LABEL[metric]}
      </p>
      <svg ref={ref} role="img" aria-label={`${METRIC_LABEL[metric]} by model`} />
    </div>
  );
}
