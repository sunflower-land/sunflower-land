import { getInteriorRoute } from "features/interior/lib/interiorRoutes";
import type { GameState } from "features/game/types/game";

/**
 * Where clicking the player's home building (tent / house / manor / mansion /
 * town center) should navigate.
 *
 * `game` is whichever farm the building belongs to — while visiting that is the
 * *visited* farm's state — so the `interiors` experiment toggle (settings menu →
 * Experiments) is always read off the owner of the house rather than the player
 * looking at it. Players without the toggle keep the legacy `/home` surface.
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
  const interiorsEnabled = !!game.settings.interiorsEnabled;

  if (isVisiting) {
    return interiorsEnabled
      ? getInteriorRoute({ floor: "ground", visitedFarmId: farmId })
      : `/visit/${farmId}/home`;
  }

  return interiorsEnabled ? getInteriorRoute({ floor: "ground" }) : "/home";
}
