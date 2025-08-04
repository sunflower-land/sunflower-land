import Decimal from "decimal.js-light";
// import { randomUUID } from "crypto";
import { BuildingName } from "../../types/buildings";
import {
  CompostBuilding,
  CropMachineBuilding,
  GameState,
  PlacedItem,
} from "../../types/game";
import { produce } from "immer";
import { ComposterName } from "features/game/types/composters";
import { getReadyAt } from "./startComposter";
import { getBoostedAwakeAt } from "features/game/lib/animals";
import { RECIPES } from "features/game/lib/crafting";
import { getBoostedCraftingTime } from "./startCrafting";

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
  return produce(state, (stateCopy) => {
    const bumpkin = stateCopy.bumpkin;

    if (bumpkin === undefined) {
      throw new Error(PLACE_BUILDING_ERRORS.NO_BUMPKIN);
    }

    const buildingInventory =
      stateCopy.inventory[action.name] || new Decimal(0);
    const placed = stateCopy.buildings[action.name] || [];
    const hasUnplacedBuildings = buildingInventory
      .minus(1)
      .greaterThanOrEqualTo(
        placed.filter((building) => building.coordinates).length,
      );

    if (!hasUnplacedBuildings) {
      throw new Error(PLACE_BUILDING_ERRORS.NO_UNPLACED_BUILDINGS);
    }

    const existingBuilding = placed.find((building) => !building.coordinates);

    if (existingBuilding) {
      // Assign the coordinates to the building
      existingBuilding.coordinates = action.coordinates;

      // Update the readyAt for Cooking buildings
      if (existingBuilding.crafting) {
        existingBuilding.crafting.forEach((crafting) => {
          crafting.readyAt = createdAt + (crafting.timeRemaining ?? 0);
          delete crafting.timeRemaining;
        });
      }

      // Update the readyAt for Composters
      if (
        (
          [
            "Compost Bin",
            "Turbo Composter",
            "Premium Composter",
          ] as ComposterName[]
        ).includes(action.name as ComposterName)
      ) {
        const existingComposter = existingBuilding as CompostBuilding;
        if (existingComposter.producing && existingComposter.removedAt) {
          const timeOffset =
            existingComposter.removedAt - existingComposter.producing.startedAt;
          existingComposter.producing.startedAt = createdAt - timeOffset;
          const timeRemaining = getReadyAt({
            gameState: stateCopy,
            composter: action.name as ComposterName,
          }).timeToFinishMilliseconds;
          existingComposter.producing.readyAt =
            createdAt + timeRemaining - timeOffset;
        }
      }

      // Update the readyAt for Crop Machine
      if (action.name === "Crop Machine") {
        const existingCropMachine = existingBuilding as CropMachineBuilding;
        if (existingCropMachine.queue) {
          existingCropMachine.queue.forEach((pack) => {
            if (pack.readyAt) {
              pack.readyAt = createdAt + (pack.pausedTimeRemaining ?? 0);
            }
            if (pack.growsUntil) {
              pack.growsUntil = createdAt + (pack.pausedTimeRemaining ?? 0);
            }
          });
        }
      }

      // Greenhouse
      if (action.name === "Greenhouse") {
        const { greenhouse } = stateCopy;
        Object.values(greenhouse.pots).forEach((pot) => {
          if (pot.plant && existingBuilding.removedAt) {
            const existingProgress =
              existingBuilding.removedAt - pot.plant.plantedAt;
            pot.plant.plantedAt = createdAt - existingProgress;
          }
        });
      }

      // Henhouse & Barn
      if (action.name === "Hen House" || action.name === "Barn") {
        const buildingKey = action.name === "Hen House" ? "henHouse" : "barn";
        const { animals } = stateCopy[buildingKey];

        Object.values(animals).forEach((animal) => {
          if (existingBuilding.removedAt) {
            const timeOffset = existingBuilding.removedAt - animal.asleepAt;
            animal.asleepAt = createdAt - timeOffset;
            const { awakeAt } = getBoostedAwakeAt({
              animalType: animal.type,
              createdAt: animal.asleepAt, // use asleepAt to calculate the new awakeAt
              game: stateCopy,
            });
            animal.awakeAt = awakeAt;
          }
        });
      }

      if (action.name === "Crafting Box") {
        const { craftingBox } = stateCopy;
        if (existingBuilding.removedAt && craftingBox.item) {
          const timeOffset = existingBuilding.removedAt - craftingBox.startedAt;
          craftingBox.startedAt = createdAt - timeOffset;
          const { seconds: recipeTime } = craftingBox.item.collectible
            ? getBoostedCraftingTime({
                game: stateCopy,
                time:
                  RECIPES(stateCopy)[craftingBox.item.collectible]?.time ?? 0,
              })
            : getBoostedCraftingTime({
                game: stateCopy,
                time: RECIPES(stateCopy)[craftingBox.item.wearable]?.time ?? 0,
              });
          craftingBox.readyAt = createdAt + recipeTime;
        }
      }

      delete existingBuilding.removedAt;

      return stateCopy;
    }

    const newBuilding: PlacedItem = {
      id: action.id,
      createdAt: createdAt,
      coordinates: action.coordinates,
      readyAt: createdAt,
    };

    return {
      ...stateCopy,
      buildings: {
        ...stateCopy.buildings,
        [action.name]: [...placed, newBuilding],
      },
    };
  });
}
