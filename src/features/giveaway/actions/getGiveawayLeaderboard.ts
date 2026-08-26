import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import type { GiveawayLeaderboardResponse } from "../lib/types";
import { mockGiveawayLeaderboard } from "../lib/mockGiveaways";

/**
 * Full board for a single giveaway: status, prize list, top-10 leaderboard and
 * ALL ranked participant farm IDs. Poll this to render the live board and to
 * decide the join/claim gating.
 */
export async function getGiveawayLeaderboard({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<GiveawayLeaderboardResponse> {
  // Offline / UI mode: no backend — serve a local fixture board.
  if (!CONFIG.API_URL) return mockGiveawayLeaderboard(id);

  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "giveawayLeaderboard");
  url.searchParams.set("id", id);

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (!response.ok) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { data } = await response.json();

  return data as GiveawayLeaderboardResponse;
}
