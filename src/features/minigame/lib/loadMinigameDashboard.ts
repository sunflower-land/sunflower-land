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
    !("playerEconomy" in body) ||
    !("actions" in body)
  ) {
    throw new Error("Invalid player economy session response");
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
      balances: raw.playerEconomy.balances,
      generating: raw.playerEconomy.generating as Record<string, any>,
      activity: raw.playerEconomy.activity,
      dailyActivity: raw.playerEconomy.dailyActivity,
      dailyMinted: raw.playerEconomy.dailyMinted,
      ...(raw.playerEconomy.dailyActionUses
        ? { dailyActionUses: raw.playerEconomy.dailyActionUses }
        : {}),
      ...(raw.playerEconomy.purchaseCounts != null
        ? { purchaseCounts: { ...raw.playerEconomy.purchaseCounts } }
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
