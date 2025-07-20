import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  CriticalHitName,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";
import { produce } from "immer";
import { getCropYieldAmount } from "./plant";
import cloneDeep from "lodash.clonedeep";

export type HarvestCropMachineAction = {
  type: "cropMachine.harvested";
  packIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestCropMachineAction;
  createdAt?: number;
};

/**
 * run getCropYieldAmount for each amount times to get the yield amount per each seed
 */
export function getPackYieldAmount(
  state: GameState,
  pack: CropMachineQueueItem,
): number {
  let totalYield = 0;

  const { criticalHit = {}, seeds, crop } = pack;
  const criticalHitObj = cloneDeep(criticalHit);

  const criticalDrop = (name: CriticalHitName) => {
    if (criticalHitObj[name]) {
      criticalHitObj[name]--;
      return true;
    }
    return false;
  };

  for (let i = 0; i < seeds; i++) {
    totalYield += getCropYieldAmount({
      game: state,
      crop,
      criticalDrop,
    });
  }
  return totalYield;
}

export function harvestCropMachine({
  state,
  action,
  createdAt = Date.now(),
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
    const amount = getPackYieldAmount(stateCopy, pack);
    stateCopy.inventory[pack.crop] = cropsInInventory.add(amount);
    bumpkin.activity = trackActivity(
      `${pack.crop} Harvested`,
      bumpkin.activity,
      new Decimal(pack.seeds),
    );

    // Filter out the harvested crops and add them to the player's inventory
    machine.queue = machine.queue.filter(
      (_, index) => index !== action.packIndex,
    );

    return stateCopy;
  });
}
