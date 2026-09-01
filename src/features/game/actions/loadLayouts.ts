import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import { ART_MODE } from "features/auth/lib/authMachine";
import { getArtModeLayouts } from "features/game/lib/artModeLayouts";
import type { LayoutsData } from "./layoutEffects";

/**
 * Loads the player's saved layouts (and the ascension re-apply pointer) from
 * `/data`. Layouts live in their own collection server-side and are not part
 * of the session or autosave payloads — fetch them lazily (opening the Saved
 * Layouts modal, and around ascensions) and mutate them via the layout
 * effects (actions/layoutEffects.ts). The farm is scoped by the session
 * token.
 */
export async function loadLayouts({
  token,
}: {
  token: string;
}): Promise<LayoutsData> {
  // ART_MODE has no API — serve the in-memory dummy store instead.
  if (ART_MODE) return getArtModeLayouts();

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

  return data as LayoutsData;
}
