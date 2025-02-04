import Decimal from "decimal.js-light";
import { CROPS, CropName, CropSeedName } from "features/game/types/crops";
import {
  CropMachineBuilding,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { produce } from "immer";
import { SeedName } from "features/game/types/seeds";

export type AddSeedsInput = {
  type: CropSeedName;
  amount: number;
};

export type SupplyCropMachineAction = {
  type: "cropMachine.supplied";
  seeds?: AddSeedsInput;
  oil?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SupplyCropMachineAction;
  createdAt?: number;
};

export const MAX_QUEUE_SIZE = (state: GameState): number =>
  state.bumpkin.skills["Field Expansion Module"] ? 10 : 5;

export const CROP_MACHINE_PLOTS = (state: GameState): number =>
  state.bumpkin.skills["Field Extension Module"] ? 15 : 10;

export const OIL_PER_HOUR_CONSUMPTION = (state: GameState) => {
  let addtionalOil = 1;
  if (state.bumpkin.skills["Crop Processor Unit"]) {
    addtionalOil += 0.1;
  }
  if (state.bumpkin.skills["Rapid Rig"]) {
    addtionalOil += 0.4;
  }

  let oilReduction = 1;

  if (state.bumpkin.skills["Oil Gadget"]) {
    oilReduction -= 0.1;
  }

  if (state.bumpkin.skills["Efficiency Extension Module"]) {
    oilReduction -= 0.3;
  }

  const oilConsumedPerHour = addtionalOil * oilReduction;

  return oilConsumedPerHour;
};
// 2 days worth of oil
export const MAX_OIL_CAPACITY_IN_HOURS = (state: GameState) =>
  state.bumpkin.skills["Leak-Proof Tank"] ? 48 * 3 : 48;

export const MAX_OIL_CAPACITY_IN_MILLIS = (state: GameState) =>
  MAX_OIL_CAPACITY_IN_HOURS(state) * 60 * 60 * 1000;

export function getTotalOilMillisInMachine(
  queue: CropMachineQueueItem[],
  unallocatedOilTime: number,
  now: number = Date.now(),
) {
  const oil = queue.reduce((totalOil, item) => {
    // There is no oil to allocated to this pack
    if (!item.startTime) return totalOil;

    // Completely allocated pack has started growing but has not reached the readyAt time
    // therefore it is currently using its allocation of oil
    // add the unused oil to the total oil
    if (item.readyAt && item.startTime <= now && item.readyAt > now) {
      return totalOil + item.readyAt - now;
    }

    // Completely allocated pack hasn't started growing yet. Add the entire allocation to the total oil
    if (item.readyAt && item.startTime > now) {
      return totalOil + item.readyAt - item.startTime;
    }

    // Partially allocated pack hasn't started growing yet. Add the entire allocation to the total oil.
    if (item.growsUntil && item.startTime > now) {
      return totalOil + item.growsUntil - item.startTime;
    }

    // Partially allocated pack has started growing and is currently growing but has not reached the growsUntil time
    // therefore it is currently using its oil allocation
    // add the unused oil to the total oil
    if (item.growsUntil && item.startTime <= now && item.growsUntil > now) {
      return totalOil + item.growsUntil - now;
    }

    return totalOil;
  }, unallocatedOilTime ?? 0);

  return Math.max(oil, 0);
}

export function calculateCropTime(
  seeds: {
    type: CropSeedName;
    amount: number;
  },
  state: GameState,
): number {
  if (!state || !state.bumpkin) {
    return 0; // Or some default value if state or bumpkin is undefined
  }

  const cropName = seeds.type.split(" ")[0] as CropName;

  let milliSeconds = CROPS[cropName].harvestSeconds * 1000;

  if (state.bumpkin.skills?.["Crop Processor Unit"]) {
    milliSeconds = milliSeconds * 0.95;
  }

  if (state.bumpkin.skills?.["Rapid Rig"]) {
    milliSeconds = milliSeconds * 0.8;
  }

  return (milliSeconds * seeds.amount) / CROP_MACHINE_PLOTS(state);
}

export function getOilTimeInMillis(oil: number, state: GameState) {
  // return the time in milliseconds
  return (oil / OIL_PER_HOUR_CONSUMPTION(state)) * 60 * 60 * 1000;
}

export function updateCropMachine({
  state,
  now,
}: {
  state: GameState;
  now: number;
}) {
  const stateCopy = cloneDeep<GameState>(state);

  // Ensure the crop machine exists
  if (!stateCopy.buildings["Crop Machine"]) {
    throw new Error("Crop Machine does not exist");
  }

  const cropMachine = stateCopy.buildings[
    "Crop Machine"
  ][0] as CropMachineBuilding;
  const queue = cropMachine.queue ?? [];

  queue.forEach((pack, index) => {
    // Skip packs that are already grown or if there's no oil left
    if (!!pack.readyAt || !cropMachine.unallocatedOilTime) {
      return;
    }

    const previousQueueItemReadyAt = queue[index - 1]?.readyAt ?? now;

    // Allocate oil to the pack and update its state
    if (cropMachine.unallocatedOilTime >= pack.growTimeRemaining) {
      completelyAllocatePack(
        pack,
        cropMachine,
        index,
        previousQueueItemReadyAt,
        now,
      );
    } else {
      partiallyAllocatedPack(
        pack,
        cropMachine,
        index,
        previousQueueItemReadyAt,
        now,
      );
    }
  });

  return cropMachine;
}

/**
 * Allocates all the oil for the complete growth of a pack.
 */
function completelyAllocatePack(
  pack: CropMachineQueueItem,
  cropMachine: CropMachineBuilding,
  index: number,
  previousQueueItemReadyAt: number,
  now: number,
) {
  setPackStartTime(pack, index, previousQueueItemReadyAt, now);

  (cropMachine.unallocatedOilTime as number) -= pack.growTimeRemaining;

  if (pack.growsUntil) {
    // If the pack was previously growing, update its readyAt time
    pack.readyAt =
      pack.growsUntil < now
        ? now + pack.growTimeRemaining
        : pack.growsUntil + pack.growTimeRemaining;

    delete pack.growsUntil;
  } else {
    // If the pack was not previously growing, set its readyAt time
    pack.readyAt =
      Math.max(previousQueueItemReadyAt, now) + pack.growTimeRemaining;
  }

  pack.growTimeRemaining = 0;
}

/**
 * Allocates a partial amount of oil to the pack. It will not be able to grow completely.
 */
function partiallyAllocatedPack(
  pack: CropMachineQueueItem,
  cropMachine: CropMachineBuilding,
  index: number,
  previousQueueItemReadyAt: number,
  now: number,
) {
  setPackStartTime(pack, index, previousQueueItemReadyAt, now);

  updateGrowsUntil(
    pack,
    previousQueueItemReadyAt,
    now,
    cropMachine.unallocatedOilTime as number,
  );

  pack.growTimeRemaining -= cropMachine.unallocatedOilTime as number;
  cropMachine.unallocatedOilTime = 0;
}

/**
 * Sets the start time for a pack if it doesn't already have one.
 */
function setPackStartTime(
  pack: CropMachineQueueItem,
  index: number,
  previousQueueItemReadyAt: number,
  now: number,
) {
  if (!pack.startTime) {
    pack.startTime =
      index === 0 ? now : Math.max(previousQueueItemReadyAt, now);
  }
}

/**
 * Updates the growsUntil time for a pack.
 */
function updateGrowsUntil(
  pack: CropMachineQueueItem,
  previousQueueItemReadyAt: number,
  now: number,
  unallocatedOilTime: number,
) {
  if (pack.growsUntil) {
    pack.growsUntil =
      pack.growsUntil > now
        ? pack.growsUntil + unallocatedOilTime
        : now + unallocatedOilTime;
  } else {
    pack.growsUntil =
      previousQueueItemReadyAt < now
        ? now + unallocatedOilTime
        : previousQueueItemReadyAt + unallocatedOilTime;
  }
}

export const BASIC_CROP_MACHINE_SEEDS: SeedName[] = [
  "Sunflower Seed",
  "Potato Seed",
  "Pumpkin Seed",
];

export const CROP_EXTENSION_MOD_SEEDS: SeedName[] = [
  "Carrot Seed",
  "Cabbage Seed",
];

export function supplyCropMachine({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const oilAdded = action.oil ?? 0;
    const seedsAdded = action.seeds ?? {
      type: "Sunflower Seed",
      amount: 0,
    };

    if (seedsAdded.amount < 0 || oilAdded < 0) {
      throw new Error("Invalid amount supplied");
    }

    if (!stateCopy.bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    if (!stateCopy.buildings["Crop Machine"]?.[0]) {
      throw new Error("Crop Machine does not exist");
    }

    const seedName = seedsAdded.type;

    if (
      !state.bumpkin.skills["Crop Extension Module"] &&
      !BASIC_CROP_MACHINE_SEEDS.includes(seedName)
    ) {
      throw new Error("You can only supply basic crop seeds!");
    }

    if (
      !!state.bumpkin.skills["Crop Extension Module"] &&
      !BASIC_CROP_MACHINE_SEEDS.includes(seedName) &&
      !CROP_EXTENSION_MOD_SEEDS.includes(seedName)
    ) {
      throw new Error("You can't supply these seeds");
    }

    const cropMachine = stateCopy.buildings["Crop Machine"][0];

    const previousSeedsInInventory =
      stateCopy.inventory[seedName] ?? new Decimal(0);

    if (previousSeedsInInventory.lt(seedsAdded.amount)) {
      throw new Error("Missing requirements");
    }

    const queue = cropMachine.queue ?? [];

    if (seedsAdded.amount > 0 && queue.length + 1 > MAX_QUEUE_SIZE(state)) {
      throw new Error("Queue is full");
    }

    // removes seeds from the player's inventory
    stateCopy.inventory[seedName] = previousSeedsInInventory.minus(
      seedsAdded.amount,
    );

    const previousOilInInventory = stateCopy.inventory["Oil"] ?? new Decimal(0);

    if (previousOilInInventory.lt(oilAdded)) {
      throw new Error("Missing requirements");
    }

    stateCopy.inventory["Oil"] = previousOilInInventory.minus(oilAdded);

    const oilMillisInMachine = getTotalOilMillisInMachine(
      queue,
      cropMachine.unallocatedOilTime ?? 0,
    );

    if (
      oilMillisInMachine + getOilTimeInMillis(oilAdded, state) >
      MAX_OIL_CAPACITY_IN_MILLIS(state)
    ) {
      throw new Error("Oil capacity exceeded");
    }

    if (oilAdded > 0) {
      cropMachine.unallocatedOilTime =
        (cropMachine.unallocatedOilTime ?? 0) +
        getOilTimeInMillis(oilAdded, state);
    }

    const crop = seedName.split(" ")[0] as CropName;

    if (seedsAdded.amount > 0) {
      queue.push({
        seeds: seedsAdded.amount,
        // getPackYieldAmount is computationally expensive - let the backend provide this
        amount: 0,
        // amount: getPackYieldAmount(seedsAdded.amount, crop, stateCopy),
        crop,
        growTimeRemaining: calculateCropTime(seedsAdded, state),
        totalGrowTime: calculateCropTime(seedsAdded, state),
      });
      stateCopy.buildings["Crop Machine"][0].queue = queue;
    }

    stateCopy.buildings["Crop Machine"][0] = updateCropMachine({
      now: createdAt,
      state: stateCopy,
    });

    return stateCopy;
  });
}
