import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import {
  LeaderboardType,
  cacheLeaderboardData,
  getCachedLeaderboardData,
} from "./cache";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  leaderboardName: "lanterns" | "tickets";
};

export type RankData = {
  id: number;
  count: number;
  rank?: number;
};

export type Leaderboard = {
  topTen: RankData[];
  farmRankingDetails?: RankData[] | null;
  lastUpdated: number;
  total: number;
};

export async function getLeaderboard({
  farmId,
  leaderboardName,
}: Options): Promise<Leaderboard | undefined> {
  const response = await window.fetch(
    `${API_URL}/leaderboard/${leaderboardName}/${farmId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    }
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    return;
  }

  return await response.json();
}

export async function fetchLeaderboardData(
  farmId: number
): Promise<LeaderboardType | null> {
  const cachedLeaderboardData = getCachedLeaderboardData();

  if (cachedLeaderboardData) return cachedLeaderboardData;

  try {
    const fetchLanternsFn = getLeaderboard({
      farmId: Number(farmId),
      leaderboardName: "lanterns",
    });

    const fetchTicketsFn = getLeaderboard({
      farmId: Number(farmId),
      leaderboardName: "tickets",
    });

    const [lanternLeaderboard, ticketLeaderboard] = await Promise.all([
      fetchLanternsFn,
      fetchTicketsFn,
    ]);

    // Leaderboard are created at the same time, so if one is missing, the other is too
    if (!lanternLeaderboard || !ticketLeaderboard) return null;

    // Likewise, their lastUpdated timestamps should be the same
    const lastUpdated = lanternLeaderboard.lastUpdated;

    cacheLeaderboardData({
      lanterns: lanternLeaderboard,
      tickets: ticketLeaderboard,
      lastUpdated,
    });

    return {
      lanterns: lanternLeaderboard,
      tickets: ticketLeaderboard,
      lastUpdated,
    };
  } catch (error) {
    console.error("error", error);
    return null;
  }
}
