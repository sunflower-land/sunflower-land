import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import type { GiveawaysResponse } from "../lib/types";
import { mockGiveaways } from "../lib/mockGiveaways";

/**
 * Discovery feed for giveaways (`GET /data?type=giveaways`). Returns what's on
 * now / coming up (`active`, soonest-first) plus the last ~10 finalised
 * (`recent`, newest-first). Lightweight by design (no participants) — drill into
 * an id via `getGiveawayLeaderboard` for the full board / winners.
 */
export async function getGiveaways({
  token,
}: {
  token: string;
}): Promise<GiveawaysResponse> {
  // Offline / UI mode: no backend — serve local fixtures.
  if (!CONFIG.API_URL) return mockGiveaways();

  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "giveaways");

  const response = await window.fetch(url, {
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

  return {
    active: data?.active ?? [],
    recent: data?.recent ?? [],
  } as GiveawaysResponse;
}
