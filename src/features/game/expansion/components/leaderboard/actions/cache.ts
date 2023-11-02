import { TicketLeaderboard } from "./leaderboard";
// Leaderboard data is updated every 1 hour
const CACHE_DURATION_IN_MS = 1 * 60 * 60 * 1000;

const CACHE_KEY = "leaderboardData";

export type Leaderboards = {
  tickets: TicketLeaderboard;
  lastUpdated: number;
};

export function cacheLeaderboardData(data: Leaderboards): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function getCachedLeaderboardData(): Leaderboards | null {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;

  const parsedData = JSON.parse(cachedData);
  const now = Date.now();

  console.log(parsedData);

  if (now - parsedData.lastUpdated > CACHE_DURATION_IN_MS) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return parsedData;
}
