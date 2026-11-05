import type { GameState } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import type { CookingBuildingName } from "features/game/types/buildings";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { getKeys } from "lib/object";
import {
  COOKING_OIL_CAPACITY,
  refreshCookingQueue,
  settleCookingOil,
} from "features/game/lib/cookingReadiness";
import { getCookingBoostWindows } from "features/game/lib/boostWindows";

export type SupplyCookingOilAction = {
  type: "cookingOil.supplied";
  building: CookingBuildingName;
  buildingId: string;
  oilQuantity: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SupplyCookingOilAction;
  createdAt?: number;
};

// Max 5 days worth of oil so that VIP players can queue
// 4 items without having to refill between each add.
//
// This is based on the longest base cook duration being
// 30 hours for Lemon Cheesecake.
//    30 hr x 4 = 120 hrs = 5 days
export const BUILDING_DAILY_OIL_CAPACITY: Record<CookingBuildingName, number> =
  {
    // Pizza Margherita base time is 20 hours.
    "Fire Pit": 5,
    // Spaghetti al Limone base time is 15 hours.
    Kitchen: 25,
    // Slow Juice base time is 24 hours.
    "Smoothie Shack": 40,
    // Lemon Cheesecake base time is 30 hours.
    Bakery: 50,
    // Fermented Fish base time is 24 hours.
    Deli: 60,
  };

export function supplyCookingOil({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const buildings = stateCopy.buildings[action.building];
    if (!buildings?.some((building) => !!building.coordinates)) {
      throw new Error(translate("error.buildingNotExist"));
    }
    if (!getKeys(BUILDING_DAILY_OIL_CAPACITY).includes(action.building)) {
      throw new Error("Building not eligible for cooking");
    }

    const building = buildings.find((b) => b.id === action.buildingId);
    // A lifted building would otherwise take oil it cannot burn until placed.
    if (!building?.coordinates) {
      throw new Error(translate("error.buildingNotExist"));
    }

    if (!Number.isInteger(action.oilQuantity) || action.oilQuantity <= 0) {
      throw new Error("Invalid oil quantity");
    }

    const oilInInventory = stateCopy.inventory["Oil"] || new Decimal(0);

    if (oilInInventory.lessThan(action.oilQuantity)) {
      throw new Error(translate("error.notEnoughOil"));
    }

    // Settle the tank to its live level before topping it up, so the new oil only
    // flows from now — and speeds up whatever is already cooking.
    const oilByTheClock =
      settleCookingOil({
        game: stateCopy,
        building,
        buildingName: action.building,
        at: createdAt,
        convert: true,
      }) !== undefined;

    const oilCapacity = oilByTheClock
      ? COOKING_OIL_CAPACITY[action.building]
      : BUILDING_DAILY_OIL_CAPACITY[action.building];
    const oilInBuilding = building.oil || 0;

    if (oilInBuilding + action.oilQuantity > oilCapacity) {
      throw new Error(translate("error.oilCapacityExceeded"));
    }

    stateCopy.inventory["Oil"] = oilInInventory.sub(action.oilQuantity);

    building.oil = oilInBuilding + action.oilQuantity;

    if (oilByTheClock) {
      refreshCookingQueue({
        building,
        buildingName: action.building,
        windows: getCookingBoostWindows(stateCopy),
      });
    }

    return stateCopy;
  });
}
