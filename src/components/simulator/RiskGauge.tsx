import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  probability: number; // 0-1
  status: "safe" | "caution" | "conflict";
}

const STATUS_COLOR: Record<Props["status"], string> = {
  safe: "#3FDE8F",
  caution: "#FFB020",
  conflict: "#FF5C4D",
};

/** D3 arc gauge rendering the model's conflict probability as an instrument
 * readout (0-180deg sweep), coloured by predicted separation status. */
export function RiskGauge({ probability, status }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svgEl = ref.current;
    if (!svgEl) return;

    const width = 260;
    const height = 160;
    const radius = 110;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height - 10})`);

    const arcBg = d3
      .arc()
      .innerRadius(radius - 18)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .cornerRadius(8);

    g.append("path").attr("d", arcBg as any).attr("fill", "#131B26");

    const arcValue = d3
      .arc()
      .innerRadius(radius - 18)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .cornerRadius(8);

    const valuePath = g
      .append("path")
      .datum({ endAngle: -Math.PI / 2 })
      .attr("fill", STATUS_COLOR[status])
      .attr("d", arcValue as any);

    valuePath
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attrTween("d", function (d: any) {
        const interpolate = d3.interpolate(d.endAngle, -Math.PI / 2 + probability * Math.PI);
        return (t) => {
          d.endAngle = interpolate(t);
          return arcValue(d) as string;
        };
      });

    // tick marks
    const ticks = d3.range(0, 1.0001, 0.25);
    g.selectAll(".tick")
      .data(ticks)
      .join("line")
      .attr("x1", (d) => Math.cos(-Math.PI / 2 + d * Math.PI) * (radius + 6))
      .attr("y1", (d) => Math.sin(-Math.PI / 2 + d * Math.PI) * (radius + 6))
      .attr("x2", (d) => Math.cos(-Math.PI / 2 + d * Math.PI) * (radius + 14))
      .attr("y2", (d) => Math.sin(-Math.PI / 2 + d * Math.PI) * (radius + 14))
      .attr("stroke", "#4E5A6B")
      .attr("stroke-width", 1);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -34)
      .attr("fill", "#E9EEF5")
      .attr("font-family", "Space Grotesk, sans-serif")
      .attr("font-size", 30)
      .attr("font-weight", 600)
      .text(`${Math.round(probability * 100)}%`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -12)
      .attr("fill", "#8B95A5")
      .attr("font-family", "IBM Plex Mono, monospace")
      .attr("font-size", 10)
      .attr("letter-spacing", "1.5px")
      .text("CONFLICT PROBABILITY");
  }, [probability, status]);

  return <svg ref={ref} className="w-full max-w-[260px]" role="img" aria-label="Conflict probability gauge" />;
}
