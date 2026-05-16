import { gql } from '@apollo/client'

export const SEARCH_EXAMPLES_QUERY = gql`
  query SearchExamples($query: String) {
    searchExamples(query: $query)
  }
`;

export const INSPECT_QUERY = gql`
query Inspect(
  $prompt: String!,
  $layer: Int!,
  $components: [ModelComponent!]!,
  $source: SnapshotSource,
  $persist: Boolean
) {
  inspect(
    prompt: $prompt,
    layer: $layer,
    components: $components,
    source: $source,
    persist: $persist
  ) {
    tokens
    attention
    visualizations {
      heatmap {
        head
        query
        key
        value
      }
    }
  }
}
`;

export const ANALYSIS_HISTORY_QUERY = gql`
query AnalysisHistory($prompt: String, $limit: Int) {
  analysisHistory(prompt: $prompt, limit: $limit) {
    id
    prompt
    layer
    source
    createdAt
    updatedAt
  }
}
`;