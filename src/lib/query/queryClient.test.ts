import { queryClient, invalidateDomain, clearAllQueries } from "./queryClient";

describe("QueryClient Configuration", () => {
  beforeEach(() => {
    // Clear query cache before each test
    queryClient.clear();
  });

  describe("default options", () => {
    it("has correct staleTime", () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.staleTime).toBe(1000 * 60); // 1 minute
    });

    it("has correct gcTime", () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.gcTime).toBe(1000 * 60 * 5); // 5 minutes
    });

    it("has refetchOnWindowFocus disabled", () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    });

    it("has refetchOnReconnect enabled", () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.refetchOnReconnect).toBe(true);
    });

    it("uses offlineFirst network mode", () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.networkMode).toBe("offlineFirst");
    });
  });

  describe("invalidateDomain", () => {
    it("invalidates queries matching domain", async () => {
      // Set up some test data
      queryClient.setQueryData(["social", "leaderboard", 123], {
        data: "test",
      });
      queryClient.setQueryData(["social", "chat", 456], { data: "test2" });
      queryClient.setQueryData(["marketplace", "collection"], {
        data: "other",
      });

      // Invalidate social domain
      await invalidateDomain("social");

      // Check that social queries are invalidated (marked as stale)
      const socialQuery1 = queryClient.getQueryState([
        "social",
        "leaderboard",
        123,
      ]);
      const socialQuery2 = queryClient.getQueryState(["social", "chat", 456]);
      const marketplaceQuery = queryClient.getQueryState([
        "marketplace",
        "collection",
      ]);

      // Social queries should be invalidated
      expect(socialQuery1?.isInvalidated).toBe(true);
      expect(socialQuery2?.isInvalidated).toBe(true);

      // Marketplace query should not be invalidated
      expect(marketplaceQuery?.isInvalidated).toBe(false);
    });
  });

  describe("clearAllQueries", () => {
    it("clears all cached data", () => {
      // Set up some test data
      queryClient.setQueryData(["test", "query1"], { data: "test1" });
      queryClient.setQueryData(["test", "query2"], { data: "test2" });

      // Verify data exists
      expect(queryClient.getQueryData(["test", "query1"])).toBeDefined();
      expect(queryClient.getQueryData(["test", "query2"])).toBeDefined();

      // Clear all queries
      clearAllQueries();

      // Verify data is cleared
      expect(queryClient.getQueryData(["test", "query1"])).toBeUndefined();
      expect(queryClient.getQueryData(["test", "query2"])).toBeUndefined();
    });
  });
});
