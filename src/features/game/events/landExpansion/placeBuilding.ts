import cloneDeep from "lodash.clonedeep";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";

export type PlaceBuildingAction = {
  type: "building.placed";
  name: BuildingName;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBuildingAction;
  createdAt?: number;
};

export function placeBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);

  const building = action.name;
  const buildingsItem = state.buildings[building];
  const inventoryItem = state.inventory[building];

  if (!inventoryItem) {
    throw new Error("You can't place a building that is not on the inventory");
  }

  if (buildingsItem && inventoryItem?.lessThanOrEqualTo(buildingsItem.length)) {
    throw new Error("This building is already placed");
  }

  if (!(building in BUILDINGS)) {
    throw new Error("You cannot place this item");
  }

  const placed = stateCopy.buildings[action.name] || [];

  const newBuilding: Omit<PlacedItem, "id"> = {
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + 5 * 60 * 1000,
  };

  return {
    ...stateCopy,
    buildings: {
      ...stateCopy.buildings,
      [building]: [...placed, newBuilding],
    },
  };
}
