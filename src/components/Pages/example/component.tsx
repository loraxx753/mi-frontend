import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
// import { gql, useQuery } from '@apollo/client'
import { PageComponentType } from '@/lib/types'
// import Content from './content/_index.mdx'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";
import useLanguageModel, { HeatmapCell } from '@/lib/hooks/useLanguageModel';

type ContentProps = {
  onWarmupModel: () => void;
  loading: boolean;
  tokens: string[];
  heatmap: HeatmapCell[];
  source: 'MOCK' | 'FIXTURE' | 'LIVE';
  onSourceChange: (source: 'MOCK' | 'FIXTURE' | 'LIVE') => void;
  persist: boolean;
  onPersistChange: (persist: boolean) => void;
  truncateLabels: boolean;
  onToggleTruncateLabels: () => void;
  selectedHead: number;
  onSelectHead: (head: number) => void;
  contractWarning?: string;
  errorMessage?: string;
};

export const Content = ({
  onWarmupModel,
  loading,
  tokens,
  heatmap,
  source,
  onSourceChange,
  persist,
  onPersistChange,
  truncateLabels,
  onToggleTruncateLabels,
  selectedHead,
  onSelectHead,
  contractWarning,
  errorMessage,
}: ContentProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const availableHeads = useMemo(
    () => Array.from(new Set(heatmap.map((cell) => cell.head))).sort((a, b) => a - b),
    [heatmap],
  );

  const selectedHeadCells = useMemo(
    () => heatmap.filter((cell) => cell.head === selectedHead),
    [heatmap, selectedHead],
  );

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const container = d3.select(chartRef.current);
    container.selectAll('*').remove();

    if (selectedHeadCells.length === 0) {
      return;
    }

    const queries = Array.from(new Set(selectedHeadCells.map((cell) => cell.query)));
    const keys = Array.from(new Set(selectedHeadCells.map((cell) => cell.key)));

    const margin = { top: 48, right: 24, bottom: 136, left: 136 };
    const innerWidth = Math.max(420, keys.length * 44);
    const innerHeight = Math.max(420, queries.length * 44);
    const width = innerWidth + margin.left + margin.right;
    const height = innerHeight + margin.top + margin.bottom;

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'max-w-full h-auto rounded-md border bg-white');

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand<string>()
      .domain(keys)
      .range([0, innerWidth])
      .padding(0.05);

    const y = d3.scaleBand<string>()
      .domain(queries)
      .range([0, innerHeight])
      .padding(0.05);

    const maxValue = d3.max(selectedHeadCells, (cell) => cell.value) ?? 1;
    const minValue = d3.min(selectedHeadCells, (cell) => cell.value) ?? 0;
    const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxValue <= 0 ? 1 : maxValue]);

    const formatLabel = (label: string) => {
      if (!truncateLabels || label.length <= 14) {
        return label;
      }
      return `${label.slice(0, 14)}...`;
    };

    const tooltip = container
      .append('div')
      .attr('class', 'pointer-events-none absolute z-10 hidden rounded border bg-white/95 px-2 py-1 text-xs shadow');

    chart
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0).tickFormat((tick) => formatLabel(String(tick))))
      .call((group) => {
        group.select('.domain').remove();
        group.selectAll('text')
          .style('font-size', '10px')
          .style('text-anchor', 'end')
          .attr('dx', '-0.5em')
          .attr('dy', '0.1em')
          .attr('transform', 'rotate(-45)');
      });

    chart
      .append('g')
      .call(d3.axisLeft(y).tickSize(0).tickFormat((tick) => formatLabel(String(tick))))
      .call((group) => {
        group.select('.domain').remove();
        group.selectAll('text').style('font-size', '10px');
      });

    chart
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-current text-xs font-semibold')
      .text('Source Token (Key)');

    chart
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 16)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-current text-xs font-semibold')
      .text('Destination Token (Query)');

    const legendWidth = 180;
    const legendHeight = 10;
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'heatmap-legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', color(0));
    gradient.append('stop').attr('offset', '100%').attr('stop-color', color(maxValue <= 0 ? 1 : maxValue));

    svg
      .append('rect')
      .attr('x', width - legendWidth - 12)
      .attr('y', 14)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#heatmap-legend-gradient)')
      .attr('stroke', '#d4d4d8');

    svg
      .append('text')
      .attr('x', width - legendWidth - 12)
      .attr('y', 12)
      .attr('class', 'fill-current text-[10px]')
      .text(`min ${minValue.toFixed(4)}`);

    svg
      .append('text')
      .attr('x', width - 12)
      .attr('y', 12)
      .attr('text-anchor', 'end')
      .attr('class', 'fill-current text-[10px]')
      .text(`max ${maxValue.toFixed(4)}`);

    chart
      .selectAll('rect')
      .data(selectedHeadCells)
      .join('rect')
      .attr('x', (d) => x(d.key) ?? 0)
      .attr('y', (d) => y(d.query) ?? 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .style('fill', (d) => color(d.value))
      .on('mousemove', (event, d) => {
        const [xPos, yPos] = d3.pointer(event, container.node());
        tooltip
          .style('left', `${xPos + 12}px`)
          .style('top', `${yPos + 12}px`)
          .style('display', 'block')
          .html(`<div><strong>${d.query}</strong> \u2192 <strong>${d.key}</strong><br/>weight: ${d.value.toFixed(6)}</div>`);
      })
      .on('mouseleave', () => {
        tooltip.style('display', 'none');
      });

    return () => {
      tooltip.remove();
      svg.remove();
    };
  }, [selectedHeadCells, truncateLabels]);

  return <>
{/* Hero */}
  <div className="container relative py-24 lg:py-32">
    {/* Announcement Banner */}
    <h1 className="text-3xl font-bold">Lab Page</h1>
    <div className="flex justify-center">
      <Button variant="outline" className="mt-4" onClick={onWarmupModel} disabled={loading}>
        {loading ? 'Warming...' : 'Warmup Model'}
      </Button>
    </div>
    <div className="mt-4 text-center">
      {errorMessage ? <p>Error: {errorMessage}</p> : null}
      {contractWarning ? <p className="text-amber-700">Contract warning: {contractWarning}</p> : null}
      {!loading && tokens.length > 0 ? <p>Tokens: {tokens.join(' ')}</p> : null}
    </div>
    <div className="mt-6 rounded-lg border p-4 text-left">
      <p className="font-bold">Inspect Snapshot</p>
      <p className="text-sm">Token count: {tokens.length}</p>
      <p className="text-sm">Heatmap cells: {heatmap.length}</p>
      <p className="text-sm">Heads: {availableHeads.join(', ') || 'none'}</p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <label className="text-sm">
          <span className="mr-2 font-semibold">Source</span>
          <select
            className="rounded border px-2 py-1"
            value={source}
            onChange={(event) => onSourceChange(event.target.value as 'MOCK' | 'FIXTURE' | 'LIVE')}
          >
            <option value="MOCK">MOCK</option>
            <option value="FIXTURE">FIXTURE</option>
            <option value="LIVE">LIVE</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={persist}
            onChange={(event) => onPersistChange(event.target.checked)}
          />
          Persist analysis to MongoDB
        </label>
      </div>

      <div className="mt-3">
        <Button variant="outline" size="sm" onClick={onToggleTruncateLabels}>
          {truncateLabels ? 'Show full axis labels' : 'Truncate axis labels'}
        </Button>
      </div>

      {availableHeads.length > 0 ? (
        <div className="mt-3">
          <p className="text-sm font-semibold">Head selector</p>
          {availableHeads.length > 8 ? (
            <select
              className="mt-2 rounded border px-2 py-1 text-sm"
              value={selectedHead}
              onChange={(event) => onSelectHead(Number(event.target.value))}
            >
              {availableHeads.map((head) => (
                <option key={head} value={head}>Head {head}</option>
              ))}
            </select>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {availableHeads.map((head) => (
                <Button
                  key={head}
                  variant={head === selectedHead ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelectHead(head)}
                >
                  Head {head}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="relative mt-4 overflow-x-auto">
        {selectedHeadCells.length === 0 ? (
          <p className="text-sm text-muted-foreground">Run the model to render a heatmap.</p>
        ) : (
          <div ref={chartRef} />
        )}
      </div>
    </div>
  </div>
{/* End Hero */}
  </>
};


// Define the TypeScript interfaces
  export const ExamplePage: PageComponentType = () => {
    const [selectedHead, setSelectedHead] = useState<number>(0);
    const [source, setSource] = useState<'MOCK' | 'FIXTURE' | 'LIVE'>('MOCK');
    const [persist, setPersist] = useState<boolean>(true);
    const [truncateLabels, setTruncateLabels] = useState<boolean>(false);

    const { results, attention, heatmap, loading, error, run } = useLanguageModel({
      "prompt": "The quick brown fox",
      "layer": 0,
      "components": ["TOKENS", "ATTENTION_MAP"],
      source,
      persist,
    }, { auto: false });

    const contractWarning = useMemo(() => {
      if (attention.length === 0) {
        return undefined;
      }

      const expected = attention.reduce((headAcc, headMatrix) => {
        return headAcc + headMatrix.reduce((rowAcc, row) => rowAcc + row.length, 0);
      }, 0);

      if (expected !== heatmap.length) {
        return `expected ${expected} heatmap cells, received ${heatmap.length}`;
      }

      return undefined;
    }, [attention, heatmap]);

    useEffect(() => {
      const availableHeads = Array.from(new Set(heatmap.map((cell) => cell.head))).sort((a, b) => a - b);
      if (availableHeads.length === 0) {
        return;
      }
      if (!availableHeads.includes(selectedHead)) {
        setSelectedHead(availableHeads[0]);
      }
    }, [heatmap, selectedHead]);

    const handleWarmupModel = () => {
      void run();
    };
  
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error : {error.message}</p>;
    return (
      <>
      <div className='font-komika-text'>
        <HeroSection.SimpleCentered className='relative'>
          <Content
            onWarmupModel={handleWarmupModel}
            loading={loading}
            tokens={results}
            heatmap={heatmap}
            source={source}
            onSourceChange={setSource}
            persist={persist}
            onPersistChange={setPersist}
            truncateLabels={truncateLabels}
            onToggleTruncateLabels={() => setTruncateLabels((value) => !value)}
            selectedHead={selectedHead}
            onSelectHead={setSelectedHead}
            contractWarning={contractWarning}
            errorMessage={error?.message}
          />
        </HeroSection.SimpleCentered>
      </div>
      </>
    );
  }

  ExamplePage.path = "/example"