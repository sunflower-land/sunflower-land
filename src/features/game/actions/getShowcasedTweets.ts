import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import type { ShowcasedTweet } from "../types/social";

/**
 * Loads the showcased tweet feed for the in-game Community tab from `/data`.
 */
export async function getShowcasedTweets({
  token,
}: {
  token: string;
}): Promise<ShowcasedTweet[]> {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "twitter.showcased");

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

  return (data?.tweets ?? []) as ShowcasedTweet[];
}
