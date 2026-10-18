import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "lib/object";
import type { ShowcasedDesign } from "../types/social";

/**
 * Loads the featured farm designs for the in-game Design Showcase from
 * `/data`. Without an API connection it falls back to mock designs, so
 * callers never need to care which mode they are in.
 */
export async function getShowcasedDesigns({
  token,
}: {
  token: string;
}): Promise<ShowcasedDesign[]> {
  if (!CONFIG.API_URL) return getMockShowcasedDesigns();

  return fetchShowcasedDesigns({ token });
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Five random NPC outfits dressed up as showcased designs, re-rolled on every
 * call so each load shows a different set of designers.
 */
function getMockShowcasedDesigns(): ShowcasedDesign[] {
  const npcs = getKeys(NPC_WEARABLES)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return npcs.map((npc, i) => ({
    messageId: `mock-design-${npc}`,
    farmId: 1000 + i,
    username: npc,
    // Placeholder art — the real endpoint returns the farm screenshot URL
    image: "world/showcase_board.png",
    showcasedAt: Date.now() - i * DAY_MS,
    bumpkin: NPC_WEARABLES[npc],
  }));
}

async function fetchShowcasedDesigns({
  token,
}: {
  token: string;
}): Promise<ShowcasedDesign[]> {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "design.showcased");

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

  return (data?.designs ?? []) as ShowcasedDesign[];
}
