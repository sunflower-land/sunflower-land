import {
  QueryClient,
  QueryCache,
  MutationCache,
  Query,
} from "@tanstack/react-query";

// Error types that should not be retried
const NON_RETRYABLE_ERRORS = [
  "Unauthorized",
  "Forbidden",
  "Not Found",
  "Invalid token",
  "Session expired",
];

// Check if error is retryable
const isRetryableError = (error: Error): boolean => {
  const message = error.message?.toLowerCase() ?? "";

  // Don't retry auth/validation errors
  if (NON_RETRYABLE_ERRORS.some((e) => message.includes(e.toLowerCase()))) {
    return false;
  }

  // Don't retry 4xx errors (client errors)
  if ("status" in error && typeof error.status === "number") {
    const status = error.status as number;
    if (status >= 400 && status < 500) {
      return false;
    }
  }

  return true;
};

// Centralized error handler for queries
const handleQueryError = (
  error: Error,
  query: Query<unknown, unknown, unknown, readonly unknown[]>,
) => {
  const queryKey = query.queryKey;

  // Don't spam errors for background refetches that already have data
  if (query.state.data !== undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Query] Background refetch failed for ${JSON.stringify(queryKey)}:`,
      error.message,
    );
    return;
  }

  // eslint-disable-next-line no-console
  console.error(
    `[Query] Failed for ${JSON.stringify(queryKey)}:`,
    error.message,
  );
};

// Centralized error handler for mutations
const handleMutationError = (
  error: Error,
  _variables: unknown,
  _context: unknown,
  mutation: unknown,
) => {
  const mutationKey = (mutation as { options?: { mutationKey?: unknown } })
    ?.options?.mutationKey;

  // eslint-disable-next-line no-console
  console.error(
    `[Mutation] Failed${mutationKey ? ` for ${JSON.stringify(mutationKey)}` : ""}:`,
    error.message,
  );
};

// Smart retry function with exponential backoff
const smartRetry = (failureCount: number, error: Error): boolean => {
  // Max 2 retries
  if (failureCount >= 2) return false;

  // Don't retry non-retryable errors
  if (!isRetryableError(error)) return false;

  return true;
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
      // Caching strategy
      staleTime: 1000 * 60, // 1 minute - data considered fresh
      gcTime: 1000 * 60 * 5, // 5 minutes - garbage collection time

      // Retry strategy
      retry: smartRetry,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

      // Refetch behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      // Network mode - fetch even when offline to show cached data
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: (failureCount, error) =>
        failureCount < 1 && isRetryableError(error as Error),
      networkMode: "offlineFirst",
    },
  },
});

// Helper to invalidate all queries for a specific domain
export const invalidateDomain = (domain: string) => {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return Array.isArray(key) && key[0] === domain;
    },
  });
};

// Helper to clear all cached data (useful for logout)
export const clearAllQueries = () => {
  queryClient.clear();
};
