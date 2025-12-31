// AstroChart.tsx
import React, { useMemo } from "react";
import { arc as d3arc } from "d3-shape";

type Lon = number; // 0..360
type Body = { key: string; lon: Lon; glyph?: string };

export type ChartData = {
  asc: Lon;               // Ascendant absolute longitude (0..360)
  mc: Lon;                // Midheaven absolute longitude (0..360)
  cusps: Lon[];           // 12 items: cusp I..XII, absolute longitudes
  bodies: Body[];         // planets/points with absolute longitudes
};

export type AstroChartProps = {
  data: ChartData;
  size?: number;          // px, square SVG
  className?: string;
  showAspects?: boolean;
  orbDeg?: number;        // for simple example aspects (opposition only here)
};

const τ = Math.PI * 2;
const toRad = (d: number) => (d * Math.PI) / 180;
const mod = (a: number, n: number) => ((a % n) + n) % n;

// Map absolute longitude to display angle (radians)
// ASC is at 9 o’clock; longitudes increase CCW on the wheel.
function angleFromAsc(lon: Lon, asc: Lon): number {
  const off = mod(lon - asc, 360); // 0 at ASC, grows CCW
  return Math.PI - toRad(off);     // flip for SVG’s +y downward
}

// Polar → Cartesian around (0,0)
function xy(r: number, a: number): [number, number] {
  return [r * Math.cos(a), r * Math.sin(a)];
}

const signGlyphs = ["♈︎","♉︎","♊︎","♋︎","♌︎","♍︎","♎︎","♏︎","♐︎","♑︎","♒︎","♓︎"];
const signStarts = Array.from({ length: 12 }, (_, i) => i * 30); // 0,30,...330

export default function AstroChart({
  data,
  size = 700,
  className,
  showAspects = false,
  orbDeg = 6,
}: AstroChartProps) {
  console.log("AstroChart render", { data, size, showAspects, orbDeg });
  const { asc, mc, cusps = [], bodies = [] } = data;

  // Radii
  const rOuter = 0.46 * size;
  const rZ0 = 0.40 * size;
  const rZ1 = 0.43 * size;
  const rH0 = 0.28 * size;
  const rH1 = 0.37 * size;
  const rPlan = 0.33 * size;

  const arcGen = useMemo(() => d3arc(), []);
  const cx = size / 2;
  const cy = size / 2;

  // Helpers computed once per render
  const A = (lon: Lon) => angleFromAsc(lon, asc);

  // House arcs (optional): between cusp n and n+1; here we just draw sign arcs.
  const signArcs = useMemo(
    () =>
      signStarts.map((start, i) => {
        const sa = A(start);
        let ea = A(start + 30);
        while (ea <= sa) ea += τ; // ensure forward sweep
        const d = arcGen({
          innerRadius: rZ0,
          outerRadius: rZ1,
          startAngle: sa,
          endAngle: ea,
        })!;
        const mid = sa + (ea - sa) / 2;
        const [lx, ly] = xy((rZ0 + rZ1) / 2, mid);
        return { d, label: signGlyphs[i], lx, ly };
      }),
    [asc, rZ0, rZ1, arcGen]
  );

  const angleLines = useMemo(() => {
    const DSC = mod(asc + 180, 360);
    const IC = mod(mc + 180, 360);
    return [
      { lon: asc, stroke: "#000", width: 2, label: "ASC" },
      { lon: DSC, stroke: "#000", width: 2, label: "DSC" },
      { lon: mc, stroke: "#000", width: 2, label: "MC" },
      { lon: IC, stroke: "#000", width: 2, label: "IC" },
    ];
  }, [asc, mc]);

  // Simple aspect demo: oppositions only (extend if needed)
  const aspectLines = useMemo(() => {
    if (!showAspects || bodies.length < 2) return [];
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const sep = (a: number, b: number) => {
      const d = Math.abs(a - b);
      return Math.min(d, 360 - d);
    };
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const s = sep(bodies[i].lon, bodies[j].lon);
        if (Math.abs(s - 180) <= orbDeg) {
          const ai = A(bodies[i].lon);
          const aj = A(bodies[j].lon);
          const [x1, y1] = xy(rPlan, ai);
          const [x2, y2] = xy(rPlan, aj);
          lines.push({ x1, y1, x2, y2 });
        }
      }
    }
    return lines;
  }, [bodies, asc, orbDeg, rPlan, showAspects]);

  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <g transform={`translate(${cx},${cy})`}>
        {/* Backdrop rings */}
        <circle r={rOuter} fill="none" stroke="#999" />
        <circle r={rZ0} fill="none" stroke="#ccc" />
        <circle r={rZ1} fill="none" stroke="#ccc" />
        <circle r={rH0} fill="none" stroke="#ddd" />
        <circle r={rH1} fill="none" stroke="#ddd" />

        {/* Degree ticks (5°/10°) – visual only */}
        {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => {
          const a = Math.PI - toRad(deg); // visual reference grid
          const len = deg % 10 === 0 ? 0.023 * size : 0.012 * size;
          const [x1, y1] = xy(rZ1, a);
          const [x2, y2] = xy(rZ1 + len, a);
          return <line key={`tick-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#bbb" />;
        })}

        {/* Zodiac sign arcs + labels */}
        {signArcs.map((s, i) => (
          <g key={`sign-${i}`}>
            <path d={s.d} fill="none" stroke="#aaa" />
            <text x={s.lx} y={s.ly} dy="0.35em" fontSize={14} textAnchor="middle">
              {s.label}
            </text>
          </g>
        ))}

        {/* Angle lines */}
        {angleLines.map((ln, i) => {
          const a = A(ln.lon);
          const [x0, y0] = xy(rH0 - 0.015 * size, a);
          const [x1, y1] = xy(rOuter, a);
          const [lx, ly] = xy(rOuter + 0.03 * size, a);
          return (
            <g key={`angle-${i}`}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={ln.stroke} strokeWidth={ln.width} />
              <text x={lx} y={ly} dy="0.35em" fontSize={12} textAnchor="middle">
                {ln.label}
              </text>
            </g>
          );
        })}

        {/* House cusps (I..XII) */}
        {cusps.map((lon, i) => {
          const a = A(lon);
          const [x0, y0] = xy(rH0, a);
          const [x1, y1] = xy(rH1, a);
          const [tx, ty] = xy((rH0 + rH1) / 2, a);
          return (
            <g key={`cusp-${i}`}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#444" strokeWidth={1.2} />
              <text x={tx} y={ty} dy="0.35em" fontSize={12} textAnchor="middle">
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Planets */}
        {bodies.map((b) => {
          const a = A(b.lon);
          const [x, y] = xy(rPlan, a);
          return (
            <text
              key={b.key}
              x={x}
              y={y}
              dy="0.35em"
              fontSize={16}
              textAnchor="middle"
              aria-label={b.key}
            //   title={b.key}
            >
              {b.glyph ?? b.key}
            </text>
          );
        })}

        {/* Example aspect lines (oppositions) */}
        {aspectLines.map((L, i) => (
          <line
            key={`asp-${i}`}
            x1={L.x1}
            y1={L.y1}
            x2={L.x2}
            y2={L.y2}
            stroke="#c44"
            strokeWidth={1}
            opacity={0.6}
          />
        ))}
      </g>
    </svg>
  );
}
