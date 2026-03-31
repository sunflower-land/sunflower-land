import type { MinigameName } from "features/game/types/minigames";
import type { MinigameConfig, MinigameRuntimeState } from "./types";
import type { MinigameSessionApiPayload } from "./minigameSessionApi";
import type { MinigameDashboardData } from "./minigameDashboardTypes";
import { buildMinigameDashboardData } from "./minigameConfigHelpers";

function sessionMinigameToRuntime(
  m: MinigameSessionApiPayload["minigame"],
): MinigameRuntimeState {
  return {
    balances: m.balances,
    producing: m.producing as MinigameRuntimeState["producing"],
    dailyMinted: m.dailyMinted,
    activity: m.activity,
    dailyActivity: m.dailyActivity,
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
  const config: MinigameConfig = {
    actions: session.actions as MinigameConfig["actions"],
    items: session.items,
    descriptions: session.descriptions,
    dashboard: session.dashboard,
    playUrl: session.playUrl,
  };

  if (!config.dashboard) {
    throw new Error("Minigame API response is missing dashboard config");
  }

  return buildMinigameDashboardData(
    slug,
    portalName,
    config,
    sessionMinigameToRuntime(session.minigame),
  );
}
