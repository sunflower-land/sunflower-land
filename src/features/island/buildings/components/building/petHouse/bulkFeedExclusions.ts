import type { CookableName } from "features/game/types/consumables";

/**
 * Foods the player has opted out of using during Pet House bulk feed.
 * Stored locally (not synced to the farm save) per Elias's review on #7417 —
 * this is a client-side convenience preference, not game state, so it
 * doesn't need to cost server storage or sync across devices.
 */
const LOCAL_STORAGE_KEY = "petHouse.bulkFeedExclusions";

export function getBulkFeedExclusions(): CookableName[] {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!cached) {
    return [];
  }

  try {
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setBulkFeedExclusions(exclusions: CookableName[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exclusions));
}
