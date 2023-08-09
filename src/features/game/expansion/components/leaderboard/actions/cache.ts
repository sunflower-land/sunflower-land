import { Leaderboard } from "./leaderboard";
// Leaderboard data is updated every 4 hours
const CACHE_DURATION_IN_MS = 4 * 60 * 60 * 1000;

const CACHE_KEY = "leaderboardData";

export type LeaderboardType = {
  lanterns: Leaderboard;
  tickets: Leaderboard;
  lastUpdated: number;
};

export function cacheLeaderboardData(data: LeaderboardType): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

export function getCachedLeaderboardData(): LeaderboardType | null {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;

  const parsedData = JSON.parse(cachedData);
  const now = Date.now();

  if (now - parsedData.lastUpdated > CACHE_DURATION_IN_MS) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return parsedData;
}
