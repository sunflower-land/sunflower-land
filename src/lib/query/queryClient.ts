import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

// Centralized error handler for queries
const handleQueryError = (error: Error, query: unknown) => {
  // Don't spam errors for background refetches that already have data
  const queryState = (query as { state?: { data?: unknown } })?.state;
  if (queryState?.data !== undefined) {
    // eslint-disable-next-line no-console
    console.error("Background update failed:", error);
    return;
  }

  // eslint-disable-next-line no-console
  console.error("Query failed:", error.message);
};

// Centralized error handler for mutations
const handleMutationError = (error: Error) => {
  // eslint-disable-next-line no-console
  console.error("Mutation failed:", error.message);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleMutationError,
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute - data considered fresh
      gcTime: 1000 * 60 * 5, // 5 minutes - garbage collection time
      retry: 1, // Don't make user wait too long
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
