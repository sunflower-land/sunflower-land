import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  BoostName,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";
import { produce } from "immer";
import { getCropYieldAmount } from "./harvest";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type HarvestCropMachineAction = {
  type: "cropMachine.harvested";
  packIndex: number;
  machineId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestCropMachineAction;
  createdAt?: number;
  farmId: number;
};

/**
 * run getCropYieldAmount for each amount times to get the yield amount per each seed
 */
export function getPackYieldAmount({
  state,
  pack,
  createdAt,
  prngArgs,
}: {
  state: GameState;
  pack: CropMachineQueueItem;
  createdAt: number;
  prngArgs: { farmId: number; initialCounter: number };
}): { amount: number; boostsUsed: { name: BoostName; value: string }[] } {
  let totalYield = 0;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  const { seeds, crop } = pack;

  let counter = prngArgs.initialCounter;
  const farmId = prngArgs.farmId;

  for (let i = 0; i < seeds; i++) {
    const { amount, boostsUsed: cropBoostsUsed } = getCropYieldAmount({
      game: state,
      crop,
      createdAt,
      prngArgs: { farmId, counter },
    });

    totalYield += amount;
    boostsUsed.push(...cropBoostsUsed);
    counter++;
  }
  return { amount: totalYield, boostsUsed };
}

export function harvestCropMachine({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!stateCopy.buildings["Crop Machine"]) {
      throw new Error("Crop Machine does not exist");
    }

    const cropMachine = stateCopy.buildings["Crop Machine"].find(
      (m) => m.id === action.machineId,
    );

    if (!cropMachine || !cropMachine.coordinates) {
      throw new Error("Crop Machine not found");
    }

    if (!cropMachine.queue || cropMachine.queue?.length === 0) {
      throw new Error("Nothing in the queue");
    }

    if (!cropMachine.queue[action.packIndex]) {
      throw new Error("Pack does not exist");
    }

    const pack = cropMachine.queue[action.packIndex];

    if (!pack.readyAt || (pack.readyAt && pack.readyAt > createdAt)) {
      throw new Error("The pack is not ready yet");
    }

    // Harvest the crops from pack
    const cropsInInventory = stateCopy.inventory[pack.crop] ?? new Decimal(0);
    const initialCounter =
      stateCopy.farmActivity[`${pack.crop} Harvested`] ?? 0;
    const { amount, boostsUsed } =
      pack.amount !== undefined
        ? { amount: pack.amount, boostsUsed: [] }
        : getPackYieldAmount({
            state: stateCopy,
            pack,
            createdAt,
            prngArgs: { farmId, initialCounter },
          });

    stateCopy.inventory[pack.crop] = cropsInInventory.add(amount);
    stateCopy.farmActivity = trackFarmActivity(
      `${pack.crop} Harvested`,
      stateCopy.farmActivity,
      new Decimal(pack.seeds),
    );

    // Filter out the harvested crops and add them to the player's inventory
    cropMachine.queue = cropMachine.queue.filter(
      (_, index) => index !== action.packIndex,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
