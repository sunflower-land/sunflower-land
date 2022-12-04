import Decimal from "decimal.js-light";
// import { randomUUID } from "crypto";
import { getBumpkinLevel } from "features/game/lib/level";
import cloneDeep from "lodash.clonedeep";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";

export enum PLACE_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_UNPLACED_BUILDINGS = "You do not have extra buildings to place from your inventory!",
  MAX_BUILDINGS_REACHED = "Building limit reached for your bumpkin level!",
}

export type PlaceBuildingAction = {
  type: "building.placed";
  name: BuildingName;
  id: string;
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
  const building = BUILDINGS()[action.name];
  const bumpkin = stateCopy.bumpkin;

  if (bumpkin === undefined) {
    throw new Error(PLACE_BUILDING_ERRORS.NO_BUMPKIN);
  }

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);
  const buildingsPlaced = stateCopy.buildings[action.name]?.length || 0;
  const allowedBuildings = building.unlocksAtLevels.filter(
    (level) => bumpkinLevel >= level
  ).length;

  if (buildingsPlaced >= allowedBuildings) {
    throw new Error(PLACE_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  }

  const buildingInventory = stateCopy.inventory[action.name] || new Decimal(0);
  const placed = stateCopy.buildings[action.name] || [];
  const hasUnplacedBuildings = buildingInventory
    .minus(1)
    .greaterThanOrEqualTo(placed.length);

  if (!hasUnplacedBuildings) {
    throw new Error(PLACE_BUILDING_ERRORS.NO_UNPLACED_BUILDINGS);
  }

  const newBuilding: PlacedItem = {
    id: action.id,
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + building.constructionSeconds * 1000,
  };

  return {
    ...stateCopy,
    buildings: {
      ...stateCopy.buildings,
      [action.name]: [...placed, newBuilding],
    },
  };
}
