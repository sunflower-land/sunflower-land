import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

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
}: Options): Promise<Leaderboard> {
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
    throw new Error(ERRORS.SYNC_SERVER_ERROR);
  }

  return await response.json();
}
