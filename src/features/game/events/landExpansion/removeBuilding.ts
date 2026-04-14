import { BuildingName } from "features/game/types/buildings";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { CropMachineBuilding, GameState } from "features/game/types/game";
import { produce } from "immer";
export enum REMOVE_BUILDING_ERRORS {
  INVALID_BUILDING = "This building does not exist",
  NO_BUMPKIN = "You do not have a Bumpkin",
  BUILDING_UNDER_CONSTRUCTION = "Cannot remove a building while it's under construction",
  WATER_WELL_REMOVE_CROPS = "Cannot remove Water Well that causes crops to uproot",
  HEN_HOUSE_REMOVE_BREWING_CHICKEN = "Cannot remove Hen House that causes chickens that are brewing egg to be removed",
  BUILDING_NOT_PLACED = "Building not placed",
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

    if ((buildingToRemove.readyAt ?? 0) > createdAt) {
      throw new Error(REMOVE_BUILDING_ERRORS.BUILDING_UNDER_CONSTRUCTION);
    }

    if (!buildingToRemove.coordinates) {
      throw new Error(REMOVE_BUILDING_ERRORS.BUILDING_NOT_PLACED);
    }

    delete buildingToRemove.coordinates;
    buildingToRemove.removedAt = createdAt;

    // Cooking buildings
    if (buildingToRemove.crafting) {
      buildingToRemove.crafting.forEach((crafting) => {
        crafting.timeRemaining = crafting.readyAt - createdAt;
      });
    }

    if (action.name === "Crop Machine") {
      const cropMachine = buildingToRemove as CropMachineBuilding;
      if (cropMachine.queue) {
        cropMachine.queue.forEach((pack) => {
          if (pack.readyAt) {
            pack.pausedTimeRemaining = pack.readyAt - createdAt;
          }
          if (pack.growsUntil) {
            pack.pausedTimeRemaining = pack.growsUntil - createdAt;
          }
        });
      }
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Building Removed",
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
