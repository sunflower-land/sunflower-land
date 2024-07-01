import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { BuildingName } from "features/game/types/buildings";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_BUILDINGS = "You don't have any buildings of this type placed!",
  BUILDING_NOT_PLACED = "This building is not placed!",
}

export type MoveBuildingAction = {
  type: "building.moved";
  name: BuildingName;
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveBuildingAction;
  createdAt?: number;
};

export function moveBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const buildings = stateCopy.buildings[action.name];

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_BUILDING_ERRORS.NO_BUMPKIN);
  }

  if (!buildings) {
    throw new Error(MOVE_BUILDING_ERRORS.NO_BUILDINGS);
  }

  const collectibleToMoveIndex = buildings.findIndex(
    (collectible) => collectible.id === action.id,
  );

  if (collectibleToMoveIndex < 0) {
    throw new Error(MOVE_BUILDING_ERRORS.BUILDING_NOT_PLACED);
  }

  buildings[collectibleToMoveIndex].coordinates = action.coordinates;

  return stateCopy;
}
