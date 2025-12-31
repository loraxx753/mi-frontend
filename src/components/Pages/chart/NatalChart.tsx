import React from "react";

type SignInfo = {
    sign: string;
    degree: number;
    minutes: number;
    seconds: number;
};

type Position = {
    name: string;
    longitude: number;
    latitude: number;
    ra: number;
    dec: number;
    dateStr: string;
    sign: SignInfo;
};

type Angle = SignInfo;

type HouseCusps = {
    [house: string]: SignInfo;
};

type Houses = {
    cusps: HouseCusps;
    system: string;
};

type Aspect = {
    planetA: string;
    planetB: string;
    aspect: string;
    glyph: string;
    index: number;
    orb: {
        degree: number;
        minutes: number;
        seconds: number;
        float: number;
    };
};

export type NatalChartData = {
    positions: Position[];
    angles: {
        ascendant: Angle;
        midheaven: Angle;
        descendant: Angle;
        imumCoeli: Angle;
    };
    houses: Houses;
    aspects: Aspect[];
    northNode: SignInfo;
    southNode: SignInfo;
};

type NatalChartProps = {
    data: NatalChartData;
    size?: number;
};

const zodiac = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
];

const signColors: Record<string, string> = {
    Aries: "#e57373",
    Taurus: "#81c784",
    Gemini: "#64b5f6",
    Cancer: "#ba68c8",
    Leo: "#ffd54f",
    Virgo: "#a1887f",
    Libra: "#90caf9",
    Scorpio: "#f06292",
    Sagittarius: "#ffb74d",
    Capricorn: "#b0bec5",
    Aquarius: "#4dd0e1",
    Pisces: "#9575cd",
};

function getSignIndex(sign: string) {
    return zodiac.indexOf(sign);
}

function getAbsoluteDegree(signInfo: SignInfo) {
    const signIndex = getSignIndex(signInfo.sign);
    return (
        signIndex * 30 +
        signInfo.degree +
        signInfo.minutes / 60 +
        signInfo.seconds / 3600
    );
}

function deg2rad(deg: number) {
    return (deg * Math.PI) / 180;
}

function polarToXY(
    centerX: number,
    centerY: number,
    radius: number,
    angleDeg: number
) {
    // SVG 0deg is at 3 o'clock, so rotate -90deg to put 0deg at 12 o'clock
    const angle = deg2rad(angleDeg - 90);
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
    };
}

const planetGlyphs: Record<string, string> = {
    Sun: "☉",
    Moon: "☽",
    Mercury: "☿",
    Venus: "♀",
    Mars: "♂",
    Jupiter: "♃",
    Saturn: "♄",
    Uranus: "♅",
    Neptune: "♆",
    Pluto: "♇",
    Ceres: "⚳",
    Pallas: "⚴",
    Vesta: "⚶",
    Chiron: "⚷",
    NorthNode: "☊",
    SouthNode: "☋",
};

const aspectColors: Record<string, string> = {
    Conjunction: "#333",
    Opposition: "#e53935",
    Trine: "#43a047",
    Square: "#fb8c00",
    Sextile: "#1e88e5",
    Octile: "#8e24aa",
    Novile: "#00897b",
    Undecile: "#c0ca33",
};

export const NatalChart: React.FC<NatalChartProps> = ({
    data,
    size = 500,
}) => {
    const center = size / 2;
    const chartRadius = center * 0.92;
    const houseRadius = center * 0.82;
    const planetRadius = center * 0.7;
    const aspectRadius = center * 0.68;
    const glyphRadius = center * 0.62;
    const houseLabelRadius = center * 0.97;

    // Draw zodiac wheel
    const zodiacSectors = zodiac.map((sign, i) => {
        const startAngle = i * 30;
        const endAngle = (i + 1) * 30;
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        const start = polarToXY(center, center, chartRadius, startAngle);
        const end = polarToXY(center, center, chartRadius, endAngle);

        const d = [
            `M ${center} ${center}`,
            `L ${start.x} ${start.y}`,
            `A ${chartRadius} ${chartRadius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            "Z",
        ].join(" ");

        return (
            <path
                key={sign}
                d={d}
                fill={signColors[sign]}
                fillOpacity={0.13}
                stroke="#bbb"
                strokeWidth={1}
            />
        );
    });

    // Draw house cusps
    const houseLines = Object.entries(data.houses.cusps).map(([house, signInfo], i) => {
        const deg = getAbsoluteDegree(signInfo);
        const from = polarToXY(center, center, 0, deg);
        const to = polarToXY(center, center, houseRadius, deg);
        return (
            <line
                key={house}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#444"
                strokeWidth={i % 3 === 0 ? 2 : 1}
                opacity={i % 3 === 0 ? 0.7 : 0.4}
            />
        );
    });

    // House numbers
    const houseLabels = Object.entries(data.houses.cusps).map(([house, signInfo]) => {
        const deg = getAbsoluteDegree(signInfo) + 15; // center of house
        const pos = polarToXY(center, center, houseLabelRadius, deg);
        return (
            <text
                key={house}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.035}
                fill="#222"
                fontWeight="bold"
                style={{ userSelect: "none" }}
            >
                {house}
            </text>
        );
    });

    // Zodiac sign glyphs
    const signLabels = zodiac.map((sign, i) => {
        const deg = i * 30 + 15;
        const pos = polarToXY(center, center, chartRadius * 1.04, deg);
        return (
            <text
                key={sign}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.045}
                fill={signColors[sign]}
                fontWeight="bold"
                style={{ userSelect: "none" }}
            >
                {planetGlyphs[sign] || sign[0]}
            </text>
        );
    });

    // Planets
    const planetPoints = data.positions.map((pos) => {
        const deg = pos.longitude;
        const p = polarToXY(center, center, planetRadius, deg);
        const glyph = planetGlyphs[pos.name] || pos.name[0];
        return (
            <g key={pos.name}>
                <circle
                    cx={p.x}
                    cy={p.y}
                    r={size * 0.025}
                    fill="#fff"
                    stroke={signColors[pos.sign.sign] || "#888"}
                    strokeWidth={2}
                />
                <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={size * 0.035}
                    fill="#222"
                    fontWeight="bold"
                    style={{ userSelect: "none" }}
                >
                    {glyph}
                </text>
            </g>
        );
    });

    // North/South Node
    const nodePoints = [
        {
            ...data.northNode,
            name: "NorthNode",
            color: "#222",
        },
        {
            ...data.southNode,
            name: "SouthNode",
            color: "#888",
        },
    ].map((node) => {
        const deg = getAbsoluteDegree(node);
        const p = polarToXY(center, center, planetRadius, deg);
        const glyph = planetGlyphs[node.name] || node.name[0];
        return (
            <g key={node.name}>
                <circle
                    cx={p.x}
                    cy={p.y}
                    r={size * 0.022}
                    fill="#fff"
                    stroke={node.color}
                    strokeWidth={2}
                />
                <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={size * 0.03}
                    fill={node.color}
                    fontWeight="bold"
                    style={{ userSelect: "none" }}
                >
                    {glyph}
                </text>
            </g>
        );
    });

    // Aspects
    const planetMap: Record<string, number> = {};
    data.positions.forEach((pos) => {
        planetMap[pos.name] = pos.longitude;
    });
    planetMap["NorthNode"] = getAbsoluteDegree(data.northNode);
    planetMap["SouthNode"] = getAbsoluteDegree(data.southNode);

    const aspectLines = data.aspects.map((asp, i) => {
        const a = planetMap[asp.planetA];
        const b = planetMap[asp.planetB];
        if (a === undefined || b === undefined) return null;
        const p1 = polarToXY(center, center, aspectRadius, a);
        const p2 = polarToXY(center, center, aspectRadius, b);
        return (
            <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={aspectColors[asp.aspect] || "#aaa"}
                strokeWidth={asp.aspect === "Conjunction" ? 2 : 1}
                opacity={asp.aspect === "Conjunction" ? 0.7 : 0.5}
            />
        );
    });

    // Angles (Asc, MC, etc)
    const angleGlyphs: Record<string, string> = {
        ascendant: "ASC",
        descendant: "DSC",
        midheaven: "MC",
        imumCoeli: "IC",
    };
    const anglePoints = Object.entries(data.angles).map(([key, signInfo]) => {
        const deg = getAbsoluteDegree(signInfo);
        const p = polarToXY(center, center, glyphRadius, deg);
        return (
            <text
                key={key}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.03}
                fill="#222"
                fontWeight="bold"
                style={{ userSelect: "none" }}
            >
                {angleGlyphs[key] || key}
            </text>
        );
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Outer circle */}
            <circle
                cx={center}
                cy={center}
                r={chartRadius}
                fill="#fff"
                stroke="#888"
                strokeWidth={2}
            />
            {/* Zodiac sectors */}
            {zodiacSectors}
            {/* House lines */}
            {houseLines}
                        {/* Inner circle */}
            <circle
                cx={center}
                cy={center}
                r={aspectRadius - size * 0.04}
                fill="#fafafa"
                stroke="#bbb"
                strokeWidth={1}
            />

            {/* Aspect lines */}
            {aspectLines}
            {/* Planets */}
            {planetPoints}
            {/* Nodes */}
            {nodePoints}
            {/* Angles */}
            {anglePoints}
            {/* House numbers */}
            {houseLabels}
            {/* Zodiac sign glyphs */}
            {signLabels}
        </svg>
    );
};

export default NatalChart;