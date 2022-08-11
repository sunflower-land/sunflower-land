import { randomUUID } from "crypto";
import cloneDeep from "lodash.clonedeep";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, Building } from "../../types/game";

function generateBuildingId() {
  return randomUUID();
}

export type PlaceBuildingAction = {
  type: "building.placed";
  building: BuildingName;
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

  const building = action.building;
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

  const placed = stateCopy.buildings[action.building] || [];

  const newBuilding: Building = {
    id: generateBuildingId(),
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
