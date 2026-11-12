import type {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import type { PlacedItem } from "features/game/types/game";
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

/**
 * The oil-ledger fields a new building starts with. Buildings with an oil tank
 * start on the clock-drain ledger straight away, instead of waiting for their
 * first cook, supply or load to convert them. Their tank is empty, so there is
 * nothing to settle before `createdAt`.
 */
export function getInitialOilLedger(
  building: BuildingName,
  createdAt: number,
): Pick<PlacedItem, "oilSettledAt"> {
  return isCookingBuilding(building) || building === "Crop Machine"
    ? { oilSettledAt: createdAt }
    : {};
}
