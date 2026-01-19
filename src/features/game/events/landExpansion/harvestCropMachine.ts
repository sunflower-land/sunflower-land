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
export function getPackYieldAmount(
  state: GameState,
  pack: CropMachineQueueItem,
  farmId: number,
  createdAt: number,
): { amount: number; boostsUsed: BoostName[] } {
  let totalYield = 0;
  const boostsUsed: BoostName[] = [];

  const { seeds, crop } = pack;

  let counter = state.farmActivity[`${crop} Harvested`] ?? 0;

  for (let i = 0; i < seeds; i++) {
    const { amount, boostsUsed: cropBoostsUsed } = getCropYieldAmount({
      game: state,
      crop,
      createdAt,
      farmId,
      counter,
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
    const machine = stateCopy.buildings["Crop Machine"]?.[0];
    const { bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin does not exist");
    }

    if (!machine) {
      throw new Error("Crop Machine does not exist");
    }

    if (!machine.queue || machine.queue?.length === 0) {
      throw new Error("Nothing in the queue");
    }

    if (!machine.queue[action.packIndex]) {
      throw new Error("Pack does not exist");
    }

    const pack = machine.queue[action.packIndex];

    if (!pack.readyAt || (pack.readyAt && pack.readyAt > createdAt)) {
      throw new Error("The pack is not ready yet");
    }

    // Harvest the crops from pack
    const cropsInInventory = stateCopy.inventory[pack.crop] ?? new Decimal(0);
    const { amount, boostsUsed } =
      pack.amount !== undefined
        ? { amount: pack.amount, boostsUsed: [] }
        : getPackYieldAmount(stateCopy, pack, farmId, createdAt);

    stateCopy.inventory[pack.crop] = cropsInInventory.add(amount);
    stateCopy.farmActivity = trackFarmActivity(
      `${pack.crop} Harvested`,
      stateCopy.farmActivity,
      new Decimal(pack.seeds),
    );

    // Filter out the harvested crops and add them to the player's inventory
    machine.queue = machine.queue.filter(
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
