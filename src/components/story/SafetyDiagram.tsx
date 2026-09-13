import { motion } from "framer-motion";

interface Props {
  items: string[];
}

/**
 * Turns the safety-layers paragraph into what it's actually describing: a
 * diagram, not a sentence. Seven systems arranged as nodes around a central
 * aircraft mark, each connected by a spoke, appearing in sequence as the
 * page scrolls into view — an editorial-grid alternative to a wrapped block
 * of prose that was misaligning at several viewport widths.
 */
export function SafetyDiagram({ items }: Props) {
  const radius = 42;
  const size = 220;
  const center = size / 2;

  return (
    <div data-cursor="graphic" className="my-2 flex justify-center lg:justify-start">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full max-w-[220px] overflow-visible">
        {items.map((item, i) => {
          const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const labelX = center + (radius + 34) * Math.cos(angle);
          const labelY = center + (radius + 34) * Math.sin(angle);
          const anchor = Math.cos(angle) > 0.3 ? "start" : Math.cos(angle) < -0.3 ? "end" : "middle";

          return (
            <g key={item}>
              <motion.line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-paper-ink/15"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.09 }}
              />
              <motion.circle
                cx={x}
                cy={y}
                r="3.4"
                className="fill-accent-dim"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.35, delay: 0.35 + i * 0.09, ease: "backOut" }}
              />
              <motion.text
                x={labelX}
                y={labelY}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-paper-ink-muted font-mono"
                style={{ fontSize: 7.5, letterSpacing: "0.02em" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.09 }}
              >
                {item.toUpperCase()}
              </motion.text>
            </g>
          );
        })}

        {/* central aircraft mark */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <circle cx={center} cy={center} r="14" className="fill-none stroke-paper-ink/15" strokeWidth="0.75" />
          <path
            d={`M${center - 8} ${center} L${center + 8} ${center} M${center - 3} ${center - 5} L${center} ${center - 8} L${center + 3} ${center - 5}`}
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-paper-ink/70"
            fill="none"
          />
        </motion.g>
      </svg>
    </div>
  );
}
