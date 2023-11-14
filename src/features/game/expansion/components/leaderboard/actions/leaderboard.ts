import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import {
  Leaderboards,
  cacheLeaderboardData,
  getCachedLeaderboardData,
} from "./cache";
import { MazeAttempt } from "features/game/types/game";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  leaderboardName: "maze" | "tickets";
};

export type RankData = {
  id: number;
  count: number;
  rank?: number;
};

export type MazeAttemptStat = Pick<MazeAttempt, "time" | "health"> & {
  id: string;
  rank: number;
};

export type TicketLeaderboard = {
  topTen: RankData[];
  lastUpdated: number;
  farmRankingDetails?: RankData[] | null;
};

export type MazeLeaderboard = {
  topRanks: MazeAttemptStat[];
  weeklySflBurned: number;
  lastUpdated: number;
};

export async function getLeaderboard<T>({
  farmId,
  leaderboardName,
}: Options): Promise<T | undefined> {
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
): Promise<Leaderboards | null> {
  const cachedLeaderboardData = getCachedLeaderboardData();

  if (cachedLeaderboardData) return cachedLeaderboardData;

  try {
    const ticketLeaderboard = await getLeaderboard<TicketLeaderboard>({
      farmId: Number(farmId),
      leaderboardName: "tickets",
    });

    // Leaderboard are created at the same time, so if one is missing, the other is too
    if (!ticketLeaderboard) return null;

    // Likewise, their lastUpdated timestamps should be the same
    const lastUpdated = ticketLeaderboard.lastUpdated;

    cacheLeaderboardData({
      tickets: ticketLeaderboard,
      lastUpdated,
    });

    return {
      tickets: ticketLeaderboard,
      lastUpdated,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("error", error);
    return null;
  }
}
