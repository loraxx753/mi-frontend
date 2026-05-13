import { gql } from '@apollo/client'

export const SEARCH_EXAMPLES_QUERY = gql`
  query SearchExamples($query: String) {
    searchExamples(query: $query)
  }
`;