import type { MinigameName } from "features/game/types/minigames";
import type { PlayerEconomyConfig, PlayerEconomyRuntimeState } from "./types";
import type { MinigameSessionApiPayload } from "./minigameSessionApi";
import type { MinigameDashboardData } from "./minigameDashboardTypes";
import { buildMinigameDashboardData } from "./minigameConfigHelpers";
import {
  migrateLegacyPlayerEconomyConfigFields,
  type PlayerEconomyConfigWithLegacy,
} from "./minigameConfigMigration";
import { utcCalendarDay } from "./processPlayerEconomyAction";

function sessionPlayerEconomyToRuntime(
  m: MinigameSessionApiPayload["playerEconomy"],
): PlayerEconomyRuntimeState {
  const day = utcCalendarDay(Date.now());
  return {
    balances: m.balances,
    generating: m.generating as PlayerEconomyRuntimeState["generating"],
    dailyMinted: m.dailyMinted,
    activity: m.activity,
    dailyActivity: m.dailyActivity,
    dailyActionUses: m.dailyActionUses ?? { utcDay: day, byAction: {} },
  };
}

/**
 * Builds dashboard data from `GET /portal/:portalId/player-economy` JSON (full config from API).
 */
export function buildMinigameDashboardFromApiSession(
  slug: string,
  portalName: MinigameName,
  session: MinigameSessionApiPayload,
): MinigameDashboardData {
  const raw = {
    actions: session.actions as PlayerEconomyConfig["actions"],
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
  const config = migrateLegacyPlayerEconomyConfigFields(raw as PlayerEconomyConfigWithLegacy);

  return buildMinigameDashboardData(
    slug,
    portalName,
    config,
    sessionPlayerEconomyToRuntime(session.playerEconomy),
  );
}
