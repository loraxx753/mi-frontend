import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { INSPECT_QUERY } from '../queries/GET';

export interface HeatmapCell {
  head: number;
  query: string;
  key: string;
  value: number;
}

interface InspectResponse {
  inspect: {
    tokens: string[];
    attention: number[][][];
    visualizations: {
      heatmap: HeatmapCell[];
    };
  };
}

interface InspectVariables {
  prompt: string;
  layer: number;
  components: Array<'TOKENS' | 'ATTENTION_MAP' | 'RESIDUAL_STREAM'>;
  source?: 'MOCK' | 'FIXTURE' | 'LIVE';
  persist?: boolean;
}

interface UseLanguageModelOptions {
  auto?: boolean;
}

export default function useLanguageModel(
  variables: InspectVariables,
  options: UseLanguageModelOptions = { auto: true },
) {
  const [runQuery, { data, loading, error, called }] = useLazyQuery<InspectResponse, InspectVariables>(
    INSPECT_QUERY,
    {
      fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    if (options.auto ?? true) {
      void runQuery({ variables });
    }
  }, [options.auto, runQuery, variables]);

  const run = useCallback(
    (overrideVariables?: InspectVariables) => {
      return runQuery({ variables: overrideVariables ?? variables });
    },
    [runQuery, variables],
  );

  return {
    data,
    snapshot: data?.inspect,
    results: data?.inspect.tokens ?? [],
    attention: data?.inspect.attention ?? [],
    heatmap: data?.inspect.visualizations?.heatmap ?? [],
    loading,
    error,
    called,
    run,
  };
}
