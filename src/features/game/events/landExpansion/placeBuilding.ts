import Decimal from "decimal.js-light";
// import { randomUUID } from "crypto";
import type { BuildingName } from "../../types/buildings";
import type {
  CompostBuilding,
  CropMachineBuilding,
  GameState,
  PlacedItem,
} from "../../types/game";
import { produce } from "immer";
import type { ComposterName } from "features/game/types/composters";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  getGreenhouseBoostWindows,
  getGreenhouseGlowWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import { getReadyAt } from "./startComposter";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

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
            const { plant } = pot;
            if (plant.baseDurationMs !== undefined) {
              // Windowed plant: "pause" growth across the move. Bank the work
              // accrued before removal (already done, so it isn't redone), then
              // resume the remaining work from now against the current windows.
              // `boostedTime` keeps the pre-move progress for the growth bar;
              // `baseDurationMs` holds the remaining work still to accrue.
              // (Mirrors placePlot's lift-banking for windowed crops.)
              const banked = workAccruedAt({
                startedAt: plant.plantedAt,
                at: existingBuilding.removedAt,
                windows: [
                  ...getGreenhouseBoostWindows(stateCopy, plant.name),
                  ...getGreenhouseGlowWindows(pot.fertiliser),
                ],
              });
              plant.baseDurationMs = Math.max(plant.baseDurationMs - banked, 0);
              plant.boostedTime = (plant.boostedTime ?? 0) + banked;
              plant.plantedAt = createdAt;
            } else {
              // Legacy plant: back-date plantedAt so the moved interval
              // doesn't count.
              const existingProgress =
                existingBuilding.removedAt - plant.plantedAt;
              plant.plantedAt = createdAt - existingProgress;
            }
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
          const aging = stateCopy.agingShed.racks.aging;
          if (aging.length > 0) {
            stateCopy.agingShed.racks.aging = aging.map((slot) => ({
              ...slot,
              startedAt: slot.startedAt + downtimeDelta,
              readyAt: slot.readyAt + downtimeDelta,
            }));
          }
          const spice = stateCopy.agingShed.racks.spice;
          if (spice.length > 0) {
            stateCopy.agingShed.racks.spice = spice.map((job) => ({
              ...job,
              startedAt: job.startedAt + downtimeDelta,
              readyAt: job.readyAt + downtimeDelta,
            }));
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
