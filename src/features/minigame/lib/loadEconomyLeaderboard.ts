import { CONFIG } from "lib/config";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type EconomyLeaderboardPlayer = {
  rank: number;
  farmId: number;
  username: string;
  bumpkin?: BumpkinParts;
  level: number;
  highscore: number;
};

export type EconomyLeaderboard = {
  slug: string;
  topTen: EconomyLeaderboardPlayer[];
  lastUpdated: number;
};

export type EconomyLeaderboardResult =
  | { ok: true; data: EconomyLeaderboard }
  | { ok: false; error: string };

/**
 * `GET /data?type=economyLeaderboard&slug=<slug>` — returns the cached top-10
 * highscore list for an economy. The API regenerates at most every 10 minutes
 * and always returns `lastUpdated` so the UI can show staleness.
 */
export async function loadEconomyLeaderboard(
  slug: string,
  userToken: string | undefined,
): Promise<EconomyLeaderboardResult> {
  if (!CONFIG.API_URL) {
    return { ok: false, error: "API_URL is not configured" };
  }
  if (!userToken) {
    return { ok: false, error: "Not signed in" };
  }

  try {
    const url = new URL(`${CONFIG.API_URL}/data`);
    url.searchParams.set("type", "economyLeaderboard");
    url.searchParams.set("slug", slug);

    const response = await window.fetch(url.toString(), {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.status >= 400) {
      return {
        ok: false,
        error: `Leaderboard request failed (${response.status})`,
      };
    }

    const json = (await response.json().catch(() => ({}))) as {
      data?: EconomyLeaderboard;
    };

    if (
      !json?.data ||
      typeof json.data !== "object" ||
      !Array.isArray(json.data.topTen)
    ) {
      return { ok: false, error: "Invalid leaderboard response" };
    }

    return { ok: true, data: json.data };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Leaderboard request failed",
    };
  }
}
