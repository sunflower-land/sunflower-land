import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { CROPS, CropName, CropSeedName } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { getCropYieldAmount } from "./plant";
import { isBasicCrop } from "./harvest";

export type supplyCropMachineAction = {
  type: "cropMachine.supplied";
  seeds?: { type: CropSeedName; amount: number };
  oil?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: supplyCropMachineAction;
  createdAt?: number;
};

export const CROP_MACHINE_PLOTS = 5;
const MAX_QUEUE_SIZE = 5;
export const OIL_PER_HOUR_CONSUMPTION = 1;

export function calculateCropTime(seeds: {
  type: CropSeedName;
  amount: number;
}): number {
  const cropName = seeds.type.split(" ")[0] as CropName;

  const milliSeconds = CROPS()[cropName].harvestSeconds * 1000;

  return (milliSeconds * seeds.amount) / CROP_MACHINE_PLOTS;
}

export function getOilTimeRemaining(oil: number) {
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
    if (pack.growTimeRemaining === 0 || !cropMachine.oilTimeRemaining) {
      return pack;
    }

    if (pack.growTimeRemaining > 0) {
      if (cropMachine.oilTimeRemaining > pack.growTimeRemaining) {
        cropMachine.oilTimeRemaining -= pack.growTimeRemaining;

        delete pack.growsUntil;

        pack.readyAt =
          (queue[index - 1]?.readyAt ?? currentTime) + pack.growTimeRemaining;

        pack.growTimeRemaining = 0;
      }

      if (cropMachine.oilTimeRemaining < pack.growTimeRemaining) {
        pack.growTimeRemaining -= cropMachine.oilTimeRemaining;

        pack.growsUntil = currentTime + cropMachine.oilTimeRemaining;

        cropMachine.oilTimeRemaining = 0;
      }
      return {
        ...pack,
        growTimeRemaining: 0,
      };
    }
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

  if (queue.length + 1 >= MAX_QUEUE_SIZE) {
    throw new Error("Queue is full");
  }

  // removes seeds from the player's inventory
  stateCopy.inventory[seedsAdded.type] = previousSeedsInInventory.minus(
    seedsAdded.amount
  );

  const previousOilInInventory = stateCopy.inventory["Oil"] ?? new Decimal(0);
  stateCopy.inventory["Oil"] = previousOilInInventory.minus(oilAdded);

  stateCopy.buildings["Crop Machine"][0].oilTimeRemaining =
    getOilTimeRemaining(oilAdded);

  const crop = seedsAdded.type.split(" ")[0] as CropName;

  if (seedsAdded.amount > 0) {
    queue.push({
      amount: getPackYieldAmount(seedsAdded.amount, crop, stateCopy),
      crop,
      growTimeRemaining: calculateCropTime(seedsAdded),
    });
    stateCopy.buildings["Crop Machine"][0].queue = queue;
  }

  stateCopy.buildings["Crop Machine"][0] = updateCropMachine({
    currentTime: createdAt,
    state: stateCopy,
  });

  return stateCopy;
}
