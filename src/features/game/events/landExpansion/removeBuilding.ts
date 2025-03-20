import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/craftables";
import { Chicken, GameState } from "features/game/types/game";
import { getSupportedChickens } from "./utils";
import { hasRemoveRestriction } from "features/game/types/removeables";
import { produce } from "immer";
export enum REMOVE_BUILDING_ERRORS {
  INVALID_BUILDING = "This building does not exist",
  NO_BUMPKIN = "You do not have a Bumpkin",
  BUILDING_UNDER_CONSTRUCTION = "Cannot remove a building while it's under construction",
  WATER_WELL_REMOVE_CROPS = "Cannot remove Water Well that causes crops to uproot",
  HEN_HOUSE_REMOVE_BREWING_CHICKEN = "Cannot remove Hen House that causes chickens that are brewing egg to be removed",
}

export type RemoveBuildingAction = {
  type: "building.removed";
  name: BuildingName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveBuildingAction;
  createdAt?: number;
};

export const getUnsupportedChickens = (gameState: GameState) => {
  const supportedChickensCount = getSupportedChickens(gameState);
  const chickenKeys = getKeys(gameState.chickens);
  const chickenCount = chickenKeys.length;
  const unsupportedChickensCount = Math.max(
    0,
    chickenCount - supportedChickensCount,
  );

  // add unsupported chickens to the list last in first out
  let unsupportedChickens: Record<string, Chicken> = {};
  [...Array(unsupportedChickensCount)].forEach((_, i) => {
    const keyIndex = chickenCount - (i + 1);
    unsupportedChickens = {
      ...unsupportedChickens,
      [chickenKeys[keyIndex]]: gameState.chickens[chickenKeys[keyIndex]],
    };
  });

  return unsupportedChickens;
};

export const areUnsupportedChickensBrewing = (gameState: GameState) => {
  const unsupportedChickens = Object.values(getUnsupportedChickens(gameState));
  return unsupportedChickens.some((chicken) => !!chicken.fedAt);
};

export function removeUnsupportedChickens(gameState: GameState) {
  const unsupportedChickens = getUnsupportedChickens(gameState);

  // Remove unsupported chickens last in first out
  getKeys(unsupportedChickens).forEach((chickenKey) => {
    delete gameState.chickens[chickenKey];
  });

  return gameState.chickens;
}

export function removeBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { buildings, bumpkin } = stateCopy;
    const buildingGroup = buildings[action.name];

    if (bumpkin === undefined) {
      throw new Error(REMOVE_BUILDING_ERRORS.NO_BUMPKIN);
    }

    if (!buildingGroup) {
      throw new Error(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
    }

    const buildingToRemove = buildingGroup.find(
      (building) => building.id === action.id,
    );

    if (!buildingToRemove) {
      throw new Error(REMOVE_BUILDING_ERRORS.INVALID_BUILDING);
    }

    if (buildingToRemove.readyAt > createdAt) {
      throw new Error(REMOVE_BUILDING_ERRORS.BUILDING_UNDER_CONSTRUCTION);
    }

    const [restricted, error] = hasRemoveRestriction(
      action.name,
      action.id,
      stateCopy,
    );

    if (restricted) {
      throw new Error(error);
    }

    stateCopy.buildings[action.name] = buildingGroup.filter(
      (building) => building.id !== buildingToRemove.id,
    );

    if (action.name === "Hen House") {
      if (areUnsupportedChickensBrewing(stateCopy)) {
        throw new Error(
          REMOVE_BUILDING_ERRORS.HEN_HOUSE_REMOVE_BREWING_CHICKEN,
        );
      }

      stateCopy.chickens = removeUnsupportedChickens(stateCopy);
    }

    bumpkin.activity = trackActivity("Building Removed", bumpkin.activity);

    return stateCopy;
  });
}
