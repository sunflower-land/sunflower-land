import { SUPPORTED_MINIGAMES } from "features/game/types/minigames";

/**
 * Built-in portal minigames (not user-created slugs). These dashboards still
 * require `TOKEN_MINIGAMES` when the API enforces the flag for non-owners.
 */
export const TOKEN_MINIGAME_DASHBOARD_SLUGS: readonly string[] =
  SUPPORTED_MINIGAMES;

export function isTokenMinigameDashboardSlug(slug: string): boolean {
  return SUPPORTED_MINIGAMES.includes(
    slug as (typeof SUPPORTED_MINIGAMES)[number],
  );
}
