import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { CROPS, CropName, CropSeedName } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { getCropYieldAmount } from "./plant";
import { isBasicCrop } from "./harvest";
import { getTotalOilMillisInMachine } from "features/island/buildings/components/building/cropMachine/lib/cropMachine";

export type AddSeedsInput = { type: CropSeedName; amount: number };

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

export const MAX_QUEUE_SIZE = 5;
export const CROP_MACHINE_PLOTS = 10;
export const OIL_PER_HOUR_CONSUMPTION = 1;
// 2 days worth of oil
// export const MAX_OIL_CAPACITY_IN_MILLIS = 2 * 24 * 60 * 60 * 1000;
export const MAX_OIL_CAPACITY_IN_MILLIS = 2 * 60 * 1000;

export function calculateCropTime(seeds: {
  type: CropSeedName;
  amount: number;
}): number {
  const cropName = seeds.type.split(" ")[0] as CropName;

  const milliSeconds = CROPS()[cropName].harvestSeconds * 1000;

  return (milliSeconds * seeds.amount) / CROP_MACHINE_PLOTS;
}

export function getOilTimeInMillis(oil: number) {
  // return the time in milliseconds
  return (oil / OIL_PER_HOUR_CONSUMPTION) * 60 * 60 * 1000;
}

export function getPackYieldAmount(
  amount: number,
  crop: CropName,
  state: GameState
): number {
  if (!state.bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  // run getCropYieldAmount for each amount times to get the yield amount per each seed
  let totalYield = 0;
  for (let i = 0; i < amount; i++) {
    totalYield += getCropYieldAmount({
      game: state,
      buds: state.buds ?? {},
      inventory: state.inventory,
      crop,
    });
  }
  return totalYield;
}

export function updateCropMachine({
  state,
  currentTime,
}: {
  state: GameState;
  currentTime: number;
}) {
  const stateCopy = cloneDeep<GameState>(state);

  if (!stateCopy.buildings["Crop Machine"]) {
    throw new Error("Crop Machine does not exist");
  }

  const cropMachine = stateCopy.buildings["Crop Machine"][0];

  const queue = cropMachine.queue ?? [];

  queue.map((pack, index) => {
    if (pack.growTimeRemaining === 0 || !cropMachine.unallocatedOilTime) {
      return pack;
    }

    // If crop machine has oil to use then allocate it to the pack
    if (cropMachine.unallocatedOilTime > pack.growTimeRemaining) {
      // Provide the pack with a start time if it doesn't have one
      if (!pack.startTime) {
        // First queue item will use current time
        if (index === 0) {
          pack.startTime = currentTime;
        } else {
          // Subsequent queue items will use the previous queue item's readyAt
          const previousQueueItemReadyAt = queue[index - 1]?.readyAt as number;

          pack.startTime = previousQueueItemReadyAt;
        }
      }

      cropMachine.unallocatedOilTime -= pack.growTimeRemaining;

      delete pack.growsUntil;

      // Sets the ready at because there is enough oil to finish the pack
      pack.readyAt =
        (queue[index - 1]?.readyAt ?? currentTime) + pack.growTimeRemaining;

      pack.growTimeRemaining = 0;
    }

    // If crop machine doesn't have enough oil to finish the pack
    if (cropMachine.unallocatedOilTime < pack.growTimeRemaining) {
      if (index === 0) {
        // Allocate a startTime if there is no startTime
        if (!pack.startTime) {
          pack.startTime = currentTime;
        }

        // It updates the grows until based on the remaining oil in the crop machine
        pack.growsUntil = currentTime + cropMachine.unallocatedOilTime;
      } else {
        const previousQueueItemReadyAt = queue[index - 1]?.readyAt as number;

        // Allocate a startTime if there is no startTime
        if (!pack.startTime) {
          pack.startTime = previousQueueItemReadyAt;
        }

        // It updates the grows until based on the remaining oil in the crop machine
        pack.growsUntil =
          previousQueueItemReadyAt + cropMachine.unallocatedOilTime;
      }

      pack.growTimeRemaining -= cropMachine.unallocatedOilTime;

      // Set the crop machine oil remaining to 0 as all oil has been allocated
      cropMachine.unallocatedOilTime = 0;
    }
    return {
      ...pack,
      growTimeRemaining: 0,
    };
  });

  if (queue.length === 0) {
    return cropMachine;
  }

  return stateCopy.buildings["Crop Machine"][0];
}

export function supplyCropMachine({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const oilAdded = action.oil ?? 0;
  const seedsAdded = action.seeds ?? {
    type: "Sunflower Seed",
    amount: 0,
  };

  if (!stateCopy.bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!stateCopy.buildings["Crop Machine"]) {
    throw new Error("Crop Machine does not exist");
  }

  const cropName = seedsAdded.type.split(" ")[0] as CropName;

  if (!isBasicCrop(cropName)) {
    throw new Error("You can only supply basic crop seeds!");
  }

  const cropMachine = stateCopy.buildings["Crop Machine"][0];

  const previousSeedsInInventory =
    stateCopy.inventory[seedsAdded.type] ?? new Decimal(0);

  if (previousSeedsInInventory.lt(seedsAdded.amount)) {
    throw new Error("Missing requirements");
  }

  const queue = cropMachine.queue ?? [];

  if (queue.length + 1 > MAX_QUEUE_SIZE) {
    throw new Error("Queue is full");
  }

  // removes seeds from the player's inventory
  stateCopy.inventory[seedsAdded.type] = previousSeedsInInventory.minus(
    seedsAdded.amount
  );

  const previousOilInInventory = stateCopy.inventory["Oil"] ?? new Decimal(0);
  stateCopy.inventory["Oil"] = previousOilInInventory.minus(oilAdded);

  const oilMillisInMachine = getTotalOilMillisInMachine(
    queue,
    cropMachine.unallocatedOilTime ?? 0
  );

  if (
    oilMillisInMachine + getOilTimeInMillis(oilAdded) >
    MAX_OIL_CAPACITY_IN_MILLIS
  ) {
    throw new Error("Oil capacity exceeded");
  }

  stateCopy.buildings["Crop Machine"][0].unallocatedOilTime =
    getOilTimeInMillis(oilAdded);

  const crop = seedsAdded.type.split(" ")[0] as CropName;

  if (seedsAdded.amount > 0) {
    queue.push({
      seeds: seedsAdded.amount,
      amount: getPackYieldAmount(seedsAdded.amount, crop, stateCopy),
      crop,
      growTimeRemaining: calculateCropTime(seedsAdded),
      totalGrowTime: calculateCropTime(seedsAdded),
    });
    stateCopy.buildings["Crop Machine"][0].queue = queue;
  }

  stateCopy.buildings["Crop Machine"][0] = updateCropMachine({
    currentTime: createdAt,
    state: stateCopy,
  });

  return stateCopy;
}
