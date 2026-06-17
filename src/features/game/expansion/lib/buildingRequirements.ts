import { type BuildingName, BUILDINGS } from "features/game/types/buildings";
import type { BumpkinLevel } from "features/game/lib/level";

export function getBuildingBumpkinLevelRequired(name: BuildingName): number {
  return BUILDINGS[name].unlocksAtLevel;
}

export function isBuildingEnabled(
  bumpkinLevel: BumpkinLevel,
  name: BuildingName,
): boolean {
  const required = getBuildingBumpkinLevelRequired(name);
  // Infinity means the building isn't unlocked via bumpkin level (you get it
  // through progression), so it has no level requirement once owned.
  return required === Infinity || bumpkinLevel >= required;
}
