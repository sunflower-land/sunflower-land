import {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import { BUILDING_DAILY_OIL_CAPACITY } from "./supplyCookingOil";

// Lives in its own file so `collectRecipe.ts` can import it without
// pulling in the rest of `cook.ts` — that bigger module imports
// `getCookingAmount` from `collectRecipe`, and the bi-directional
// import is fragile under Vite HMR.
export function isCookingBuilding(
  building: BuildingName,
): building is CookingBuildingName {
  return Object.keys(BUILDING_DAILY_OIL_CAPACITY).includes(building);
}
