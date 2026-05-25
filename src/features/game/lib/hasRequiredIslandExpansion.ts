import { ISLAND_EXPANSIONS, type IslandType } from "../types/game";

export function hasRequiredIslandExpansion(
  island: IslandType,
  requiredIslandExpansion?: IslandType,
): boolean {
  if (!requiredIslandExpansion) return true;

  const currentIslandIndex = ISLAND_EXPANSIONS.findIndex(
    (name) => name === island,
  );
  const requiredIslandIndex = ISLAND_EXPANSIONS.findIndex(
    (name) => name === requiredIslandExpansion,
  );

  return currentIslandIndex >= requiredIslandIndex;
}
