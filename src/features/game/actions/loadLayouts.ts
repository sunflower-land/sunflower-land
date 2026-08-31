import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import type { SavedLayout } from "features/game/types/game";

/**
 * Loads the player's saved layouts from `/data`. Layouts live in their own
 * collection server-side and are not part of the session or autosave
 * payloads — fetch them lazily (opening the Saved Layouts modal, and before
 * ascending) and push them into the game machine with `LAYOUTS_LOADED`.
 * The farm is scoped by the session token.
 */
export async function loadLayouts({
  token,
}: {
  token: string;
}): Promise<SavedLayout[]> {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "layouts");

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

  return (data as { layouts: SavedLayout[] }).layouts;
}
