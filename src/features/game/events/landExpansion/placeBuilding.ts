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
  getCookingBoostWindows,
  getGreenhouseBoostWindows,
  getGreenhouseGlowWindows,
  pauseWindowedTimer,
} from "features/game/lib/boostWindows";
import { pauseCookingQueue } from "features/game/lib/cookingReadiness";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { mfTrack } from "lib/moonforgeAnalytics";

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

      // Pause the queue for Cooking buildings
      if (existingBuilding.crafting && existingBuilding.removedAt) {
        pauseCookingQueue({
          crafting: existingBuilding.crafting,
          removedAt: existingBuilding.removedAt,
          placedAt: createdAt,
          windows: getCookingBoostWindows(stateCopy),
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
          // Pause the batch across the lift by shifting both timestamps by the
          // downtime (the Crafting Box / Aging Shed pattern below). The batch's
          // duration is a SNAPSHOT taken by `startComposter` - re-deriving it
          // here would re-price an in-flight batch with boosts acquired after
          // it started, so placing a Soil Krabby then lifting the composter
          // took 10% off a batch already under way.
          const downtime = Math.max(0, createdAt - existingComposter.removedAt);
          existingComposter.producing.startedAt += downtime;
          existingComposter.producing.readyAt += downtime;
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
            // Pause growth across the move (windowed banking or legacy back-date).
            // trackProgress banks the pre-move work into boostedTime for the
            // growth bar. (Mirrors placePlot's lift-banking for windowed crops.)
            plant.plantedAt = pauseWindowedTimer({
              timer: plant,
              startedAt: plant.plantedAt,
              removedAt: existingBuilding.removedAt,
              createdAt,
              windows: [
                ...getGreenhouseBoostWindows(stateCopy, plant.name),
                ...getGreenhouseGlowWindows(pot.fertiliser),
              ],
              trackProgress: true,
            });
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
            // Animals shift all three timestamps together instead of using
            // `pauseWindowedTimer`, even when windowed. `asleepAt` is the
            // love-cadence anchor as well as the sleep timer's start, so moving
            // it independently of `awakeAt`/`lovedAt` compresses the cycle and
            // re-opens love slots the player has already spent — the same
            // reason `migrateSpeedBoosts` refuses to freeze animals. A windowed
            // sleep keeps its full `baseDurationMs` and resumes from the
            // shifted start, so the lifted interval still doesn't count toward
            // it; the cost is that boost credit re-accrues over a shifted
            // stretch of the shrine window, negligible against a 7-day shrine.
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

      mfTrack("building_placed", { building_type: action.name });

      return stateCopy;
    }

    const newBuilding: PlacedItem = {
      id: action.id,
      createdAt: createdAt,
      coordinates: action.coordinates,
      readyAt: createdAt,
    };

    mfTrack("building_placed", { building_type: action.name });

    return {
      ...stateCopy,
      buildings: {
        ...stateCopy.buildings,
        [action.name]: [...placedBuildings, newBuilding],
      },
    };
  });
}
