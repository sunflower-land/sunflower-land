import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";

export type YakkamonCodeResponse = {
  /** The player's Yakkamon sign up code, or null if they can't claim one yet. */
  code: string | null;
  /** The player's ascension-aware total Bumpkin level. */
  level: number;
  /**
   * The level required to claim right now. Null before the first tier opens
   * (nothing is claimable yet) and once the player already qualifies.
   */
  requiredLevel: number | null;
  /** When the next (lower) level tier opens. Null once the final tier is live. */
  nextUnlockAt: number | null;
};

/**
 * Loads the player's Yakkamon pre-registration code from `/data`. The server is
 * the authority on eligibility - it returns a null `code` when the player's
 * level tier has not opened yet.
 */
export async function getYakkamonCode({
  token,
}: {
  token: string;
}): Promise<YakkamonCodeResponse> {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "yakkamon.code");

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

  return data as YakkamonCodeResponse;
}
