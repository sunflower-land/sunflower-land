import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import {
  Leaderboards,
  cacheLeaderboard,
  getCachedLeaderboardData,
} from "./cache";
import { FactionName, MazeAttempt } from "features/game/types/game";
import { getFactionWeek } from "features/game/lib/factions";

const API_URL = CONFIG.API_URL;

type Options = {
  farmId: number;
  leaderboardName: keyof Leaderboards;
  cacheExpiry?: number;
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
    score: Record<FactionName, number>;
    marksRankingData?: RankData[] | null;
  };
  lastUpdated: number;
  status: "ready" | "pending";
  week: string;
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
  cacheExpiry,
}: Options): Promise<T | undefined> {
  const cache = getCachedLeaderboardData({
    name: leaderboardName,
    duration: cacheExpiry,
  });

  if (cache) {
    return cache as T;
  }

  const url = `${API_URL}/leaderboard/${leaderboardName}/${farmId}`;

  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    return;
  }

  const data = await response.json();

  cacheLeaderboard({ name: leaderboardName, data });

  return data;
}

const KINGDOM_LEADERBOARD_CACHE = 10 * 60 * 1000;

export async function getChampionsLeaderboard<T>({
  farmId,
  date,
}: {
  farmId: number;
  date: string;
}): Promise<KingdomLeaderboard | undefined> {
  const cache = getCachedLeaderboardData({
    name: "champions",
    duration: KINGDOM_LEADERBOARD_CACHE,
  });

  const isCorrectWeek =
    cache?.week === getFactionWeek({ date: new Date(date) });

  if (cache && isCorrectWeek) {
    return cache;
  }

  const url = `${API_URL}/leaderboard/kingdom/${farmId}?date=${date}`;

  const response = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    return;
  }

  const data = await response.json();

  cacheLeaderboard({ name: "champions", data });

  return data;
}

export async function fetchLeaderboardData(
  farmId: number,
): Promise<Leaderboards | null> {
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
        cacheExpiry: KINGDOM_LEADERBOARD_CACHE,
      }),
      getLeaderboard<EmblemsLeaderboard>({
        farmId: Number(farmId),
        leaderboardName: "emblems",
      }),
    ]);

    return {
      tickets: ticketLeaderboard,
      factions: factionsLeaderboard,
      kingdom: kingdomLeaderboard,
      emblems: emblemsLeaderboard,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("error", error);
    return null;
  }
}

// export async function fetchKingdomLeaderboard(
//   farmId: number,
//   week: string
// ): Promise<Leaderboards | null> {
//   let cachedLeaderboardData = getCachedLeaderboardData();

//   if (cachedLeaderboardData && cachedLeaderboardData?.kingdom.week === week) {
//     return cachedLeaderboardData;
//   }

//   const kingdomLeaderboard = await getLeaderboard<TicketLeaderboard>({
//         farmId: Number(farmId),
//         leaderboardName: "tickets",
//       })

//     cacheLeaderboardData({
//       tickets: cachedLeaderboardData?.tickets,
//       factions: cachedLeaderboardData.factions,
//       kingdom: kingdomLeaderboard,
//       emblems: cachedLeaderboardData.emblems,
//       lastUpdated: cachedLeaderboardData?.lastUpdated,
//     });

//     return {
//       tickets: ticketLeaderboard,
//       factions: factionsLeaderboard,
//       kingdom: kingdomLeaderboard,
//       emblems: emblemsLeaderboard,
//       lastUpdated,
//     };
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error("error", error);
//     return null;
//   }
// }
