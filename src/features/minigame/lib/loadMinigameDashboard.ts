import type { MinigameName } from "features/game/types/minigames";
import { CONFIG } from "lib/config";
import { portal } from "features/world/ui/community/actions/portal";
import {
  CHICKEN_RESCUE_COLLECT_BY_START,
  CHICKEN_RESCUE_CONFIG,
  createChickenRescueInitialState,
} from "./chickenRescueConfig";
import {
  buildChickenRescueDashboardFromSession,
  getChickenRescueDashboardUi,
} from "./chickenRescueDashboardMerge";
import type {
  FetchMinigameResult,
  MinigameDashboardData,
} from "./minigameDashboardTypes";
import {
  getMinigameSession,
  type MinigameSessionApiPayload,
} from "./minigameSessionApi";

async function fetchChickenRescueMock(): Promise<FetchMinigameResult> {
  await new Promise((r) => setTimeout(r, 120));
  const now = Date.now();
  const base = createChickenRescueInitialState(now);
  const state: MinigameDashboardData["state"] = {
    ...base,
    balances: {
      ...base.balances,
      GoldenNugget: 1002,
    },
  };
  return {
    ok: true,
    data: {
      slug: "chicken-rescue-v2",
      portalName: "chicken-rescue-v2",
      displayName: "Chicken Rescue v2",
      config: CHICKEN_RESCUE_CONFIG,
      state,
      ui: getChickenRescueDashboardUi(),
      productionCollectByStartId: { ...CHICKEN_RESCUE_COLLECT_BY_START },
    },
  };
}

function assertChickenRescueSession(
  body: unknown,
): asserts body is MinigameSessionApiPayload {
  if (
    body === null ||
    typeof body !== "object" ||
    !("minigame" in body) ||
    !("actions" in body)
  ) {
    throw new Error("Invalid minigame session response");
  }
}

/**
 * Loads dashboard data: calls the portal minigame API when `CONFIG.API_URL` is set
 * and credentials are provided; otherwise uses the local Chicken Rescue mock.
 */
export async function loadMinigameDashboard(
  slug: string,
  creds: { userToken: string; farmId: number } | null,
): Promise<FetchMinigameResult> {
  if (slug !== "chicken-rescue-v2") {
    return { ok: false, error: `Unknown minigame: ${slug}` };
  }

  if (!CONFIG.API_URL) {
    return fetchChickenRescueMock();
  }

  if (!creds?.userToken || creds.farmId == null || Number.isNaN(creds.farmId)) {
    return {
      ok: false,
      error: "Sign in and open your farm to load this minigame.",
    };
  }

  try {
    const { token: portalJwt } = await portal({
      portalId: slug as MinigameName,
      token: creds.userToken,
      farmId: creds.farmId,
    });

    const raw = await getMinigameSession(slug, portalJwt);
    assertChickenRescueSession(raw);
    return { ok: true, data: buildChickenRescueDashboardFromSession(raw) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load minigame";
    return { ok: false, error: message };
  }
}
