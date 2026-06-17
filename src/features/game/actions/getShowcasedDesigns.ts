import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import type { ShowcasedDesign } from "../types/social";

/**
 * Loads the featured farm designs for the in-game Design Showcase from `/data`.
 */
export async function getShowcasedDesigns({
  token,
}: {
  token: string;
}): Promise<ShowcasedDesign[]> {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "design.showcased");

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

  return (data?.designs ?? []) as ShowcasedDesign[];
}
