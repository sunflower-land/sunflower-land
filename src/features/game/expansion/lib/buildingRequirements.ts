import { type BuildingName, BUILDINGS } from "features/game/types/buildings";
import {
  type AscensionLevel,
  type LevelRequirement,
  meetsLevelRequirement,
} from "features/game/lib/level";

export function getBuildingBumpkinLevelRequired(
  name: BuildingName,
): LevelRequirement {
  return BUILDINGS[name].unlocksAtLevel;
}

export function isBuildingEnabled(
  level: Pick<AscensionLevel, "ascension" | "level">,
  name: BuildingName,
): boolean {
  const required = getBuildingBumpkinLevelRequired(name);
  // Infinity means the building isn't unlocked via bumpkin level (you get it
  // through progression), so it has no level requirement once owned.
  return required.level === Infinity || meetsLevelRequirement(level, required);
}
