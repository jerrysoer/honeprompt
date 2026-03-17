import type { IterationResult } from "../data/run-data";

interface ScoreChartProps {
  history: IterationResult[];
  visibleCount: number;
}

export function ScoreChart({ history, visibleCount }: ScoreChartProps) {
  const width = 600;
  const height = 280;
  const padding = { top: 40, right: 20, bottom: 40, left: 50 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Use all data for scale, but only render up to visibleCount
  const allScores = history.map((h) => h.scores.average);
  const minScore = Math.max(0, Math.min(...allScores) - 10);
  const maxScore = Math.min(100, Math.max(...allScores) + 10);
  const scoreRange = maxScore - minScore || 1;

  const visible = history.slice(0, visibleCount + 1);
  const scores = visible.map((h) => h.scores.average);

  const points = scores.map((score, i) => {
    const x = padding.left + (i / Math.max(history.length - 1, 1)) * chartW;
    const y =
      padding.top + chartH - ((score - minScore) / scoreRange) * chartH;
    return { x, y, score, iteration: i };
  });

  if (points.length === 0) return null;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const lastPoint = points[points.length - 1]!;
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${padding.top + chartH} L ${points[0]!.x.toFixed(1)} ${padding.top + chartH} Z`;

  // Y-axis ticks
  const yTicks = 4;
  const yTickValues = Array.from(
    { length: yTicks + 1 },
    (_, i) => minScore + (scoreRange * i) / yTicks,
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-2xl"
      role="img"
      aria-label="Score chart showing optimization progress"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2410C" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#C2410C" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTickValues.map((val) => {
        const y = padding.top + chartH - ((val - minScore) / scoreRange) * chartH;
        return (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={padding.left + chartW}
              y2={y}
              stroke="#E7E0D8"
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fill="#78716C"
              fontSize={11}
              fontFamily="monospace"
            >
              {Math.round(val)}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {history.map((_, i) => {
        const x = padding.left + (i / Math.max(history.length - 1, 1)) * chartW;
        return (
          <text
            key={i}
            x={x}
            y={padding.top + chartH + 20}
            textAnchor="middle"
            fill="#78716C"
            fontSize={11}
            fontFamily="monospace"
          >
            {i}
          </text>
        );
      })}

      {/* Axis labels */}
      <text
        x={padding.left + chartW / 2}
        y={height - 4}
        textAnchor="middle"
        fill="#78716C"
        fontSize={12}
        fontFamily="system-ui"
      >
        Iteration
      </text>

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)">
        <animate attributeName="opacity" from="0" to="1" dur="0.5s" fill="freeze" />
      </path>

      {/* Score line */}
      <path
        d={linePath}
        fill="none"
        stroke="#C2410C"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data points */}
      {points.map((p, i) => {
        const iter = visible[i]!;
        const isBaseline = i === 0;
        const isKept = !isBaseline && iter.kept;
        const isReverted = !isBaseline && !iter.kept;

        let fill = "#C2410C"; // baseline
        if (isKept) fill = "#15803D";
        if (isReverted) fill = "#B91C1C";

        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isBaseline ? 5 : isKept ? 5 : 3.5}
              fill={fill}
              stroke="white"
              strokeWidth={2}
              opacity={isReverted ? 0.6 : 1}
            />
            {/* Score label on point */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fill="#1C1917"
              fontSize={11}
              fontWeight={600}
              fontFamily="monospace"
            >
              {Math.round(p.score)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
