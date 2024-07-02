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
  leaderboardName: "maze" | "tickets" | "factions" | "kingdom" | "emblems";
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

type Percentiles = 1 | 5 | 10 | 20 | 50 | 80 | 100;
export type PercentileData = Record<Percentiles, number>;

export type FactionLeaderboard = {
  percentiles: Record<FactionName, PercentileData>;
  topTens: Record<FactionName, RankData[]>;
  totalMembers: Record<FactionName, number>;
  totalTickets: Record<FactionName, number>;
  lastUpdated: number;
  farmRankingDetails?: RankData[] | null;
};

export type KingdomLeaderboard = {
  marks: {
    topTens: Record<FactionName, RankData[]>;
    totalMembers: Record<FactionName, number>;
    totalTickets: Record<FactionName, number>;
    marksRankingData?: RankData[] | null;
  };
  lastUpdated: number;
};

export type EmblemsLeaderboard = {
  emblems: {
    topTens: Record<FactionName, RankData[]>;
    totalMembers: Record<FactionName, number>;
    totalTickets: Record<FactionName, number>;
    emblemRankingData?: RankData[] | null;
  };
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
    },
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
  farmId: number,
): Promise<Leaderboards | null> {
  let cachedLeaderboardData = getCachedLeaderboardData();

  // This is only required for one hour after kingdom launch
  // If reading this comment after kingdom launch, June 14th, 2024, delete this conditional
  // and update `let` to `const` above.
  if (
    cachedLeaderboardData !== null &&
    !("percentiles" in cachedLeaderboardData.factions)
  ) {
    cachedLeaderboardData = null;
  }

  if (cachedLeaderboardData) return cachedLeaderboardData;

  try {
    const [
      ticketLeaderboard,
      factionsLeaderboard,
      kingdomLeaderboard,
      emblemsLeaderboard,
    ] = await Promise.all([
      getLeaderboard<TicketLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "tickets",
      }),
      getLeaderboard<FactionLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "factions",
      }),
      getLeaderboard<KingdomLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "kingdom",
      }),
      getLeaderboard<EmblemsLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "emblems",
      }),
    ]);

    // Leaderboard are created at the same time, so if one is missing, the other is too
    if (
      !ticketLeaderboard ||
      !factionsLeaderboard ||
      !kingdomLeaderboard ||
      !emblemsLeaderboard
    )
      return null;

    // Likewise, their lastUpdated timestamps should be the same
    const lastUpdated = ticketLeaderboard.lastUpdated;

    cacheLeaderboardData({
      tickets: ticketLeaderboard,
      factions: factionsLeaderboard,
      kingdom: kingdomLeaderboard,
      emblems: emblemsLeaderboard,
      lastUpdated,
    });

    return {
      tickets: ticketLeaderboard,
      factions: factionsLeaderboard,
      kingdom: kingdomLeaderboard,
      emblems: emblemsLeaderboard,
      lastUpdated,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("error", error);
    return null;
  }
}
