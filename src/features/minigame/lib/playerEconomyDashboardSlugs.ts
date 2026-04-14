import { SUPPORTED_MINIGAMES } from "features/game/types/minigames";

/**
 * Built-in portal slugs (not user-created). Non-owners need `PLAYER_ECONOMIES` when the API enforces the flag.
 */
export const PLAYER_ECONOMY_DASHBOARD_SLUGS: readonly string[] =
  SUPPORTED_MINIGAMES;

export function isPlayerEconomyDashboardSlug(slug: string): boolean {
  return SUPPORTED_MINIGAMES.includes(
    slug as (typeof SUPPORTED_MINIGAMES)[number],
  );
}
