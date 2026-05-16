import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_API_URL || "http://localhost:7004/graphql",
    cache: new InMemoryCache(),
});
