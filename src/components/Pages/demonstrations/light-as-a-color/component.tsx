import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

import { PageComponentType } from '@/lib/types';
import { HeroSection } from '@/components/ThirdParty/UiBlocks';

export const LightAsAColorPage: PageComponentType = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [amplitude, setAmplitude] = useState<number>(50);
  const [wavelength, setWavelength] = useState<number>(180);
  const [phase, setPhase] = useState<number>(0);

  const derivedPeriod = useMemo(() => (2 * Math.PI) / wavelength, [wavelength]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const container = d3.select(chartRef.current);
    container.selectAll('*').remove();

    const width = 860;
    const height = 320;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'w-full h-auto rounded-md border bg-white');

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([0, innerWidth]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([-110, 110]).range([innerHeight, 0]);

    const samples = d3.range(0, innerWidth + 1, 2).map((xPos) => ({
      x: xPos,
      y: amplitude * Math.sin((2 * Math.PI * xPos) / wavelength + phase),
    }));

    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => x(d.x))
      .y((d) => y(d.y))
      .curve(d3.curveMonotoneX);

    chart
      .append('g')
      .attr('transform', `translate(0, ${y(0)})`)
      .call(d3.axisBottom(x).ticks(8).tickSizeOuter(0))
      .call((group) => {
        group.select('.domain').attr('stroke', '#cbd5e1');
        group.selectAll('line').attr('stroke', '#cbd5e1');
        group.selectAll('text').attr('fill', '#64748b').style('font-size', '10px');
      });

    chart
      .append('g')
      .call(d3.axisLeft(y).ticks(6).tickSizeOuter(0))
      .call((group) => {
        group.select('.domain').attr('stroke', '#cbd5e1');
        group.selectAll('line').attr('stroke', '#cbd5e1');
        group.selectAll('text').attr('fill', '#64748b').style('font-size', '10px');
      });

    chart
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', '#94a3b8')
      .attr('stroke-dasharray', '4 4');

    chart
      .append('path')
      .datum(samples)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', line);

    chart
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 32)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-current text-xs')
      .text('x (sample distance)');

    chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -28)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-current text-xs')
      .text('y (wave height)');

    return () => {
      svg.remove();
    };
  }, [amplitude, wavelength, phase]);

  return (
    <div className="font-komika-text">
      <HeroSection.SimpleCentered className="relative">
        <div className="container relative py-24 lg:py-32">
          <h1 className="text-4xl font-bold">Light as a Color</h1>
          <p className="mt-4 max-w-2xl text-lg">
            A basic sine-wave visualizer to play with wave parameters before we connect this to richer light/color models.
          </p>
          <div className="mt-8 rounded-lg border p-6 text-left">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Demonstration</p>
            <p className="mt-2 text-2xl font-semibold">light is a wave is a color</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We will slice off more demos like this one as the lab grows.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Amplitude</span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={amplitude}
                  onChange={(event) => setAmplitude(Number(event.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{amplitude}</span>
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Wavelength</span>
                <input
                  type="range"
                  min={60}
                  max={360}
                  step={1}
                  value={wavelength}
                  onChange={(event) => setWavelength(Number(event.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{wavelength}</span>
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Phase Shift</span>
                <input
                  type="range"
                  min={-3.14}
                  max={3.14}
                  step={0.01}
                  value={phase}
                  onChange={(event) => setPhase(Number(event.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{phase.toFixed(2)} rad</span>
              </label>
            </div>

            <div className="mt-4 rounded-md border bg-slate-50 p-3 text-sm">
              <p className="mb-2">Sine model:</p>
              <BlockMath math={'y = A \\cdot \\sin\\left(\\frac{2\\pi x}{\\lambda} + \\phi\\right)'} />
              <p className="text-muted-foreground">
                Approx period coefficient (
                <InlineMath math={'\\frac{2\\pi}{\\lambda}'} />
                ): {derivedPeriod.toFixed(4)}
              </p>
            </div>

            <div className="mt-4" ref={chartRef} />
          </div>
        </div>
      </HeroSection.SimpleCentered>
    </div>
  );
};

LightAsAColorPage.path = '/demonstrations/light-as-a-color';
