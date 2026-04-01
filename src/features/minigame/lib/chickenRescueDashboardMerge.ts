import type { MinigameName } from "features/game/types/minigames";
import type { MinigameConfig, MinigameRuntimeState } from "./types";
import type { MinigameSessionApiPayload } from "./minigameSessionApi";
import type { MinigameDashboardData } from "./minigameDashboardTypes";
import { buildMinigameDashboardData } from "./minigameConfigHelpers";
import {
  migrateLegacyMinigameConfigFields,
  type MinigameConfigWithLegacy,
} from "./minigameConfigMigration";
import { utcCalendarDay } from "./processMinigameAction";

function sessionMinigameToRuntime(
  m: MinigameSessionApiPayload["minigame"],
): MinigameRuntimeState {
  const day = utcCalendarDay(Date.now());
  return {
    balances: m.balances,
    producing: m.producing as MinigameRuntimeState["producing"],
    dailyMinted: m.dailyMinted,
    activity: m.activity,
    dailyActivity: m.dailyActivity,
    dailyActionUses: m.dailyActionUses ?? { utcDay: day, byAction: {} },
  };
}

/**
 * Builds dashboard data from `GET /portal/:portalId/minigame` JSON (full config from API).
 */
export function buildMinigameDashboardFromApiSession(
  slug: string,
  portalName: MinigameName,
  session: MinigameSessionApiPayload,
): MinigameDashboardData {
  const raw = {
    actions: session.actions as MinigameConfig["actions"],
    items: session.items,
    descriptions: session.descriptions,
    visualTheme: session.visualTheme,
    playUrl: session.playUrl,
    ...(session.initialBalances ? { initialBalances: session.initialBalances } : {}),
    ...(session.productionCollectByStartId
      ? { productionCollectByStartId: session.productionCollectByStartId }
      : {}),
    ...(session.dashboard ? { dashboard: session.dashboard } : {}),
  };
  const config = migrateLegacyMinigameConfigFields(raw as MinigameConfigWithLegacy);

  return buildMinigameDashboardData(
    slug,
    portalName,
    config,
    sessionMinigameToRuntime(session.minigame),
  );
}
