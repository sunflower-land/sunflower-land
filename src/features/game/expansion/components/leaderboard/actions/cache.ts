import {
  TicketLeaderboard,
  FactionLeaderboard,
  KingdomLeaderboard,
} from "./leaderboard";
// Leaderboard data is updated every 1 hour
const CACHE_DURATION_IN_MS = 1 * 60 * 60 * 1000;

const CACHE_KEY = "leaderboardData";

export type Leaderboards = {
  tickets: TicketLeaderboard;
  factions: FactionLeaderboard;
  kingdom: KingdomLeaderboard;
  lastUpdated: number;
};

export function cacheLeaderboardData(data: Leaderboards): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

export function getCachedLeaderboardData(): Leaderboards | null {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);
    const now = Date.now();

    if (now - parsedData.lastUpdated > CACHE_DURATION_IN_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsedData;
  } catch {
    return null;
  }
}
