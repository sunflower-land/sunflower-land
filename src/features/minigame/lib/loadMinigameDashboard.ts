import type { MinigameName } from "features/game/types/minigames";
import { CONFIG } from "lib/config";
import { portal } from "features/world/ui/community/actions/portal";
import { buildMinigameDashboardData } from "./minigameConfigHelpers";
import { utcCalendarDay } from "./processPlayerEconomyAction";
import { getLocalMinigameDashboardMock } from "./localMinigameDashboardMock";
import type { FetchMinigameResult } from "./minigameDashboardTypes";
import {
  getMinigameSession,
  resolvePlayerEconomySessionItems,
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
 * Loads dashboard data: calls `GET /data?type=economy.loaded` when `CONFIG.API_URL` is set
 * and credentials are provided; otherwise returns a hard-coded local mock.
 */
export async function loadMinigameDashboard(
  slug: string,
  creds: { userToken: string; farmId: number } | null,
): Promise<FetchMinigameResult> {
  if (!CONFIG.API_URL) {
    return { ok: true, data: getLocalMinigameDashboardMock(slug) };
  }

  if (!creds?.userToken || creds.farmId == null || Number.isNaN(creds.farmId)) {
    return { ok: false, error: { kind: "sign_in_required" } };
  }

  try {
    const { token: portalJwt } = await portal({
      portalId: slug,
      token: creds.userToken,
      farmId: creds.farmId,
    });

    const raw = await getMinigameSession(slug, portalJwt, creds.farmId);
    assertChickenRescueSession(raw);

    const pe = raw.playerEconomy;
    const day = utcCalendarDay(Date.now());
    const state = {
      balances: pe.balances,
      generating: pe.generating as Record<string, any>,
      activity: pe.activity,
      dailyActivity: pe.dailyActivity ?? { date: day, count: 0 },
      dailyMinted: pe.dailyMinted ?? { utcDay: day, minted: {} },
      ...(pe.dailyActionUses ? { dailyActionUses: pe.dailyActionUses } : {}),
      ...(pe.purchaseCounts != null
        ? { purchaseCounts: { ...pe.purchaseCounts } }
        : {}),
    };
    const config = {
      actions: raw.actions as Record<string, any>,
      items: resolvePlayerEconomySessionItems(raw),
      descriptions: raw.descriptions,
      visualTheme: raw.visualTheme,
      playUrl: raw.playUrl,
      ...(raw.mainCurrencyToken
        ? { mainCurrencyToken: raw.mainCurrencyToken }
        : {}),
      ...(raw.purchases ? { purchases: raw.purchases } : {}),
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
