import { useQuery } from '@apollo/client';
import { SEARCH_EXAMPLES_QUERY } from '../queries/GET';

interface SearchExamplesResponse {
  searchExamples: string[];
}

interface SearchExamplesVariables {
  query?: string;
}

export function useExampleSearch(query: string) {
  const normalizedQuery = query.trim();
  const { data, loading, error } = useQuery<SearchExamplesResponse, SearchExamplesVariables>(SEARCH_EXAMPLES_QUERY, {
    variables: { query: normalizedQuery || undefined },
  });

  console.log('useExampleSearch - query:', normalizedQuery);
  console.log('useExampleSearch - data:', data);
  console.log('useExampleSearch - loading:', loading);
  console.log('useExampleSearch - error:', error);

  return {
    results: data?.searchExamples ?? [],
    loading,
    error,
  };
}
