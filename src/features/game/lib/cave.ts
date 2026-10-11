import type { GameState } from "features/game/types/game";

/**
 * Whether the Cave building is placed on the farm and has finished
 * construction. `game.cave` is created the moment the building is bought, so
 * every cave.* event checks this too - otherwise the Cave could be used
 * during its build timer, or from the chest.
 */
export function isCaveBuildingReady(
  game: Pick<GameState, "buildings">,
  now: number,
): boolean {
  return (game.buildings.Cave ?? []).some(
    (building) => (building.readyAt ?? 0) <= now && !!building.coordinates,
  );
}
