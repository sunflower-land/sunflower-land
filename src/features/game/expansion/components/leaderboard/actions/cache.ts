import {
  TicketLeaderboard,
  FactionLeaderboard,
  KingdomLeaderboard,
  EmblemsLeaderboard,
} from "./leaderboard";

// Leaderboard data is updated every 10 minutes
const CACHE_DURATION_IN_MS = 10 * 60 * 1000;

const CACHE_KEY = "leaderboardData";

export type Leaderboards = {
  tickets?: TicketLeaderboard;
  factions?: FactionLeaderboard;
  kingdom?: KingdomLeaderboard;
  emblems?: EmblemsLeaderboard;
};

export function cacheLeaderboard<T extends keyof Leaderboards>({
  name,
  data,
}: {
  name: T;
  data: Leaderboards[T];
}): void {
  try {
    localStorage.setItem(`${name}.${CACHE_KEY}`, JSON.stringify(data));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

export function getCachedLeaderboardData<T extends keyof Leaderboards>({
  name,
}: {
  name: T;
}): Leaderboards[T] | null {
  try {
    const cachedData = localStorage.getItem(`${name as string}.${CACHE_KEY}`);
    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);
    const now = Date.now();

    if (now - parsedData.lastUpdated > CACHE_DURATION_IN_MS) {
      localStorage.removeItem(`${name as string}.${CACHE_KEY}`);
      return null;
    }

    return parsedData;
  } catch {
    return null;
  }
}
