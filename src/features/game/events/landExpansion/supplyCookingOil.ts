import { GameState } from "features/game/types/game";
import { translate } from "lib/i18n/translate";
import { CookingBuildingName } from "features/game/types/buildings";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { getKeys } from "features/game/types/craftables";

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

// Max 2 days worth of oil
export const BUILDING_DAILY_OIL_CAPACITY: Record<CookingBuildingName, number> =
  {
    "Fire Pit": 2,
    Kitchen: 10,
    "Smoothie Shack": 16,
    Bakery: 20,
    Deli: 24,
  };

export function supplyCookingOil({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const buildings = stateCopy.buildings[action.building];
    if (!buildings) {
      throw new Error(translate("error.buildingNotExist"));
    }
    if (!getKeys(BUILDING_DAILY_OIL_CAPACITY).includes(action.building)) {
      throw new Error("Building not eligible for cooking");
    }

    const building = buildings.find((b) => b.id === action.buildingId);
    if (!building) {
      throw new Error(translate("error.buildingNotExist"));
    }

    const oilInInventory = stateCopy.inventory["Oil"] || new Decimal(0);

    if (oilInInventory.lessThan(action.oilQuantity)) {
      throw new Error(translate("error.notEnoughOil"));
    }

    const oilCapacity = BUILDING_DAILY_OIL_CAPACITY[action.building];
    const oilInBuilding = building.oil || 0;

    if (oilInBuilding + action.oilQuantity > oilCapacity) {
      throw new Error(translate("error.oilCapacityExceeded"));
    }

    stateCopy.inventory["Oil"] = oilInInventory.sub(action.oilQuantity);

    building.oil = oilInBuilding + action.oilQuantity;

    return stateCopy;
  });
}
