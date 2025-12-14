// Query Key Factory for React Query
// Allows easy cache invalidation and consistent key structure
// Usage: useQuery({ queryKey: playerKeys.detail(farmId), ... })
// Invalidation: queryClient.invalidateQueries({ queryKey: playerKeys.all })

export const playerKeys = {
  all: ["player"] as const,
  details: () => [...playerKeys.all, "detail"] as const,
  detail: (farmId: number) => [...playerKeys.details(), farmId] as const,
};

export const socialKeys = {
  all: ["social"] as const,
  leaderboard: (farmId: number) =>
    [...socialKeys.all, "leaderboard", farmId] as const,
  blessingResults: (date: string) =>
    [...socialKeys.all, "blessing-results", date] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  flower: () => [...dashboardKeys.all, "flower"] as const,
  economy: (startDate?: string, endDate?: string) =>
    [...dashboardKeys.all, "economy", { startDate, endDate }] as const,
  ledger: (id: string) => [...dashboardKeys.all, "ledger", id] as const,
};

export const liquidityKeys = {
  all: ["liquidity"] as const,
  player: (address: string) =>
    [...liquidityKeys.all, "player", address] as const,
};

export const referralKeys = {
  all: ["referral"] as const,
  referrees: (farmId: number) =>
    [...referralKeys.all, "referrees", farmId] as const,
};

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  collections: () => [...marketplaceKeys.all, "collection"] as const,
  collection: (type: string, filters?: Record<string, unknown>) =>
    [...marketplaceKeys.collections(), type, filters] as const,
  tradeable: (collection: string, id: number) =>
    [...marketplaceKeys.all, "tradeable", collection, id] as const,
  hotNow: () => [...marketplaceKeys.all, "hot-now"] as const,
  whatsNew: (type: string) =>
    [...marketplaceKeys.all, "whats-new", type] as const,
};

export const auctionKeys = {
  all: ["auction"] as const,
  history: () => [...auctionKeys.all, "history"] as const,
  results: (auctionId: string) =>
    [...auctionKeys.history(), auctionId] as const,
};
