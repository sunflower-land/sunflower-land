import type { MinigameName } from "features/game/types/minigames";
import { CONFIG } from "lib/config";
import { portal } from "features/world/ui/community/actions/portal";
import { buildMinigameDashboardData } from "./minigameConfigHelpers";
import type { FetchMinigameResult } from "./minigameDashboardTypes";
import {
  getMinigameSession,
  type MinigameSessionApiPayload,
} from "./minigameSessionApi";

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
  if (!CONFIG.API_URL)
    return { ok: false, error: { kind: "sign_in_required" } };

  if (!creds?.userToken || creds.farmId == null || Number.isNaN(creds.farmId)) {
    return { ok: false, error: { kind: "sign_in_required" } };
  }

  try {
    const { token: portalJwt } = await portal({
      portalId: slug as MinigameName,
      token: creds.userToken,
      farmId: creds.farmId,
    });

    const raw = await getMinigameSession(slug, portalJwt);
    assertChickenRescueSession(raw);
    const state = {
      balances: raw.minigame.balances,
      producing: raw.minigame.producing as Record<string, any>,
      activity: raw.minigame.activity,
      dailyActivity: raw.minigame.dailyActivity,
      dailyMinted: raw.minigame.dailyMinted,
      ...(raw.minigame.dailyActionUses
        ? { dailyActionUses: raw.minigame.dailyActionUses }
        : {}),
      ...(raw.minigame.purchaseCounts != null
        ? { purchaseCounts: { ...raw.minigame.purchaseCounts } }
        : {}),
    };
    const config = {
      actions: raw.actions as Record<string, any>,
      items: raw.items,
      descriptions: raw.descriptions,
      visualTheme: raw.visualTheme,
      playUrl: raw.playUrl,
      ...(raw.initialBalances ? { initialBalances: raw.initialBalances } : {}),
      ...(raw.productionCollectByStartId
        ? { productionCollectByStartId: raw.productionCollectByStartId }
        : {}),
      ...(raw.dashboard ? { dashboard: raw.dashboard } : {}),
    };
    return {
      ok: true,
      data: buildMinigameDashboardData(
        slug,
        slug as MinigameName,
        config,
        state,
      ),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load minigame";
    return { ok: false, error: { kind: "message", text: message } };
  }
}
