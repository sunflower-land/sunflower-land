import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import {
  Leaderboards,
  cacheLeaderboardData,
  getCachedLeaderboardData,
} from "./cache";
import { FactionName, MazeAttempt } from "features/game/types/game";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  leaderboardName: "maze" | "tickets" | "factions";
};

export type RankData = {
  id: string;
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

export type FactionLeaderboard = {
  topTens: Record<FactionName, RankData[]>;
  totalMembers: Record<FactionName, number>;
  totalTickets: Record<FactionName, number>;
  lastUpdated: number;
  farmRankingDetails?: RankData[] | null;
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
    const [ticketLeaderboard, factionsLeaderboard] = await Promise.all([
      getLeaderboard<TicketLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "tickets",
      }),
      getLeaderboard<FactionLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "factions",
      }),
    ]);

    // Leaderboard are created at the same time, so if one is missing, the other is too
    if (!ticketLeaderboard || !factionsLeaderboard) return null;

    // Likewise, their lastUpdated timestamps should be the same
    const lastUpdated = ticketLeaderboard.lastUpdated;

    cacheLeaderboardData({
      tickets: ticketLeaderboard,
      factions: factionsLeaderboard,
      lastUpdated,
    });

    return {
      tickets: ticketLeaderboard,
      factions: factionsLeaderboard,
      lastUpdated,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("error", error);
    return null;
  }
}
