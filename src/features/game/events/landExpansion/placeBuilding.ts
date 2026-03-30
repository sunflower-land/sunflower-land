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
import { createInitialAgingShed } from "features/game/lib/agingShed";
import { getReadyAt } from "./startComposter";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

export enum PLACE_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_UNPLACED_BUILDINGS = "You do not have extra buildings to place from your inventory!",
  MAX_BUILDINGS_REACHED = "Building limit reached for your bumpkin level!",
}

export type PlaceBuildingAction = {
  type: "building.placed";
  name: BuildingName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBuildingAction;
  farmId: number;
  createdAt?: number;
};

export function placeBuilding({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const bumpkin = stateCopy.bumpkin;

    if (bumpkin === undefined) {
      throw new Error(PLACE_BUILDING_ERRORS.NO_BUMPKIN);
    }

    const buildingInventory =
      stateCopy.inventory[action.name] || new Decimal(0);
    const placedBuildings = stateCopy.buildings[action.name] || [];
    const hasUnplacedBuildings = buildingInventory
      .minus(1)
      .greaterThanOrEqualTo(
        placedBuildings.filter((building) => building.coordinates).length,
      );

    if (!hasUnplacedBuildings) {
      throw new Error(PLACE_BUILDING_ERRORS.NO_UNPLACED_BUILDINGS);
    }

    const existingBuilding = placedBuildings.find(
      (building) => !building.coordinates,
    );

    const isSecondBuilding =
      placedBuildings.filter((building) => building.coordinates).length >= 1;

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
      if (action.name === "Greenhouse" && !isSecondBuilding) {
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
      if (
        (action.name === "Hen House" || action.name === "Barn") &&
        !isSecondBuilding
      ) {
        const buildingKey = action.name === "Hen House" ? "henHouse" : "barn";
        const { animals } = stateCopy[buildingKey];

        Object.values(animals).forEach((animal) => {
          if (existingBuilding.removedAt) {
            const timeOffset = Math.max(
              0,
              createdAt - existingBuilding.removedAt,
            );
            animal.asleepAt = animal.asleepAt + timeOffset;
            animal.awakeAt = animal.awakeAt + timeOffset;
            animal.lovedAt = animal.lovedAt + timeOffset;
          }
        });
      }

      if (action.name === "Crafting Box" && !isSecondBuilding) {
        const { craftingBox } = stateCopy;
        const queue = craftingBox.queue ?? [];
        if (existingBuilding.removedAt && queue.length > 0) {
          const downtimeDelta = Math.max(
            0,
            createdAt - existingBuilding.removedAt,
          );
          stateCopy.craftingBox.queue = queue.map((item) => ({
            ...item,
            startedAt: item.startedAt + downtimeDelta,
            readyAt: item.readyAt + downtimeDelta,
          }));
        }
      }

      if (action.name === "Aging Shed" && !isSecondBuilding) {
        if (existingBuilding.removedAt) {
          const downtimeDelta = Math.max(
            0,
            createdAt - existingBuilding.removedAt,
          );
          if (!stateCopy.agingShed.racks) {
            stateCopy.agingShed.racks = createInitialAgingShed().racks;
          }
          const fermentation = stateCopy.agingShed.racks.fermentation;
          if (fermentation.length > 0) {
            stateCopy.agingShed.racks.fermentation = fermentation.map(
              (job) => ({
                ...job,
                startedAt: job.startedAt + downtimeDelta,
                readyAt: job.readyAt + downtimeDelta,
              }),
            );
          }
          if (stateCopy.agingShed.upgradeReadyAt !== undefined) {
            stateCopy.agingShed.upgradeReadyAt += downtimeDelta;
          }
        }
      }

      if (action.name === "Water Well" && !isSecondBuilding) {
        if (
          existingBuilding.removedAt &&
          stateCopy.waterWell.upgradeReadyAt !== undefined
        ) {
          const downtimeDelta = Math.max(
            0,
            createdAt - existingBuilding.removedAt,
          );
          stateCopy.waterWell.upgradeReadyAt += downtimeDelta;
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
        [action.name]: [...placedBuildings, newBuilding],
      },
    };
  });
}
