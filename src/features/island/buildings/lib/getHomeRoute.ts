import type { GameState } from "features/game/types/game";

/**
 * Where clicking the player's home building (tent / house / manor / mansion /
 * town center) should navigate.
 *
 * Visiting another farm always lands on that farm's `/home`. For the player's
 * own home, the `interiors` experiment toggle (settings menu → Experiments)
 * routes to the new `/interior` surface instead of the legacy `/home`.
 */
export function getHomeRoute({
  game,
  isVisiting,
  farmId,
}: {
  game: GameState;
  isVisiting: boolean;
  farmId: number;
}): string {
  if (isVisiting) return `/visit/${farmId}/home`;
  return game.settings.interiorsEnabled ? "/interior" : "/home";
}
