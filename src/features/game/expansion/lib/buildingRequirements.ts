import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import {
  EXPANSION_REQUIREMENTS,
  Land,
} from "features/game/expansion/lib/expansionRequirements";
import { BumpkinLevel } from "features/game/lib/level";

export function getBuildingBumpkinLevelRequired(
  name: BuildingName,
  _index?: number,
): number {
  let requiredExpansionLevel = 1;
  const blueprint = BUILDINGS[name];
  if (blueprint) requiredExpansionLevel = blueprint.unlocksAtLevel;
  return (
    EXPANSION_REQUIREMENTS[requiredExpansionLevel as Land]?.bumpkinLevel ?? 1
  );
}

export function isBuildingEnabled(
  bumpkinLevel: BumpkinLevel,
  name: BuildingName,
  _index?: number,
): boolean {
  return bumpkinLevel >= getBuildingBumpkinLevelRequired(name, _index);
}
