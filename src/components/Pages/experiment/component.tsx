import { useLocation } from 'react-router-dom';

import { PageComponentType } from '@/lib/types';
import { HeroSection } from '@/components/ThirdParty/UiBlocks';

function parseComponents(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

export const ExperimentPage: PageComponentType = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prompt = searchParams.get('prompt') || '';
  const layer = searchParams.get('layer') || '';
  const components = parseComponents(searchParams.get('components'));

  return (
    <div className="font-komika-text">
      <HeroSection.SimpleCentered className="relative">
        <div className="container relative py-24 lg:py-32">
          <h1 className="text-3xl font-bold">Experiment</h1>
          <p className="mt-4 text-xl">Hello world.</p>
          <div className="mt-6 rounded-lg border p-4 text-left">
            <p className="font-semibold">Query params</p>
            <p className="text-sm">prompt: {prompt || '(missing)'}</p>
            <p className="text-sm">layer: {layer || '(missing)'}</p>
            <p className="text-sm">components: {components.length > 0 ? components.join(', ') : '(missing)'}</p>
          </div>
        </div>
      </HeroSection.SimpleCentered>
    </div>
  );
};

ExperimentPage.path = '/experiment';
