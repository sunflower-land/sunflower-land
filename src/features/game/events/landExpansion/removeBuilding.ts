import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum REMOVE_BUILDING_ERRORS {
  INVALID_BUILDING = "This building does not exist",
  NO_VALID_SHOVEL_SELECTED = "No valid shovel selected!",
  NO_RUSTY_SHOVEL_AVAILABLE = "No Rusty Shovel available!",
}

export type RemoveBuildingAction = {
  type: "building.removed";
  item?: InventoryItemName;
  building: BuildingName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveBuildingAction;
  createdAt?: number;
};

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function removeBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const { buildings, inventory } = stateCopy;
  const buildingGroup = buildings[action.building];

  if (!buildingGroup) {
    throw new Error(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  }

  const buildingIndex = buildingGroup?.findIndex(
    (building) => building.id == action.id
  );

  if (buildingIndex === -1) {
    throw new Error(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
  }

  if (action.item !== "Rusty Shovel") {
    throw new Error(REMOVE_BUILDING_ERRORS.NO_VALID_SHOVEL_SELECTED);
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_BUILDING_ERRORS.NO_RUSTY_SHOVEL_AVAILABLE);
  }

  stateCopy.buildings[action.building] = removeItem(
    buildingGroup,
    buildingGroup[buildingIndex]
  );

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
