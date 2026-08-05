import Decimal from "decimal.js-light";
import {
  CROPS,
  type CropName,
  type CropSeedName,
} from "features/game/types/crops";
import type {
  BoostName,
  CropMachineBuilding,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";
import { produce } from "immer";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";

export type AddSeedsInput = {
  type: CropSeedName;
  amount: number;
};

export type SupplyCropMachineAction = {
  type: "cropMachine.supplied";
  seeds: AddSeedsInput;
  machineId: string;
};

type SupplyCropMachineOptions = {
  state: Readonly<GameState>;
  action: SupplyCropMachineAction;
  createdAt?: number;
};

const BASE_QUEUE_SIZE = 5;
export const MAX_QUEUE_SIZE = (state: GameState): number => {
  const level = getSkillLevel(state.bumpkin.skills, "Field Expansion Module");
  return level
    ? BASE_QUEUE_SIZE + SKILL_RANKS["Field Expansion Module"].ranks[level - 1]
    : BASE_QUEUE_SIZE;
};

const BASE_CROP_MACHINE_PLOTS = 10;
export const CROP_MACHINE_PLOTS = (state: GameState): number => {
  const level = getSkillLevel(state.bumpkin.skills, "Field Extension Module");
  return level
    ? BASE_CROP_MACHINE_PLOTS +
        SKILL_RANKS["Field Extension Module"].ranks[level - 1]
    : BASE_CROP_MACHINE_PLOTS;
};

export const OIL_PER_HOUR_CONSUMPTION = (state: GameState) => {
  const { skills } = state.bumpkin;
  let addtionalOil = 1;

  const cropProcessorUnitLevel = getSkillLevel(skills, "Crop Processor Unit");
  if (cropProcessorUnitLevel) {
    addtionalOil +=
      SKILL_RANKS["Crop Processor Unit"].oilPenalty[cropProcessorUnitLevel - 1];
  }

  const rapidRigLevel = getSkillLevel(skills, "Rapid Rig");
  if (rapidRigLevel) {
    addtionalOil += SKILL_RANKS["Rapid Rig"].oilPenalty[rapidRigLevel - 1];
  }

  let oilReduction = 1;

  const oilGadgetLevel = getSkillLevel(skills, "Oil Gadget");
  if (oilGadgetLevel) {
    oilReduction -= SKILL_RANKS["Oil Gadget"].ranks[oilGadgetLevel - 1];
  }

  const efficiencyExtensionModuleLevel = getSkillLevel(
    skills,
    "Efficiency Extension Module",
  );
  if (efficiencyExtensionModuleLevel) {
    oilReduction -=
      SKILL_RANKS["Efficiency Extension Module"].ranks[
        efficiencyExtensionModuleLevel - 1
      ];
  }

  const oilConsumedPerHour = addtionalOil * oilReduction;

  return oilConsumedPerHour;
};
// 2 days worth of oil
const BASE_OIL_CAPACITY_IN_HOURS = 48;
export const MAX_OIL_CAPACITY_IN_HOURS = (state: GameState) => {
  const level = getSkillLevel(state.bumpkin.skills, "Leak-Proof Tank");
  return level
    ? BASE_OIL_CAPACITY_IN_HOURS *
        SKILL_RANKS["Leak-Proof Tank"].ranks[level - 1]
    : BASE_OIL_CAPACITY_IN_HOURS;
};

export const MAX_OIL_CAPACITY_IN_MILLIS = (state: GameState) =>
  MAX_OIL_CAPACITY_IN_HOURS(state) * 60 * 60 * 1000;

export function calculateCropTime(
  seeds: {
    type: CropSeedName;
    amount: number;
  },
  state: GameState,
): { milliSeconds: number; boostUsed: { name: BoostName; value: string }[] } {
  const boostUsed: { name: BoostName; value: string }[] = [];
  const cropName = seeds.type.split(" ")[0] as CropName;

  let milliSeconds = CROPS[cropName].harvestSeconds * 1000;

  const cropProcessorUnitLevel = getSkillLevel(
    state.bumpkin.skills,
    "Crop Processor Unit",
  );
  if (cropProcessorUnitLevel) {
    const v =
      SKILL_RANKS["Crop Processor Unit"].growth[cropProcessorUnitLevel - 1];
    milliSeconds = milliSeconds * v;
    boostUsed.push({ name: "Crop Processor Unit", value: `x${v}` });
  }

  const rapidRigLevel = getSkillLevel(state.bumpkin.skills, "Rapid Rig");
  if (rapidRigLevel) {
    const v = SKILL_RANKS["Rapid Rig"].growth[rapidRigLevel - 1];
    milliSeconds = milliSeconds * v;
    boostUsed.push({ name: "Rapid Rig", value: `x${v}` });
  }

  if (isCollectibleBuilt({ game: state, name: "Groovy Gramophone" })) {
    milliSeconds = milliSeconds * 0.5;
    boostUsed.push({ name: "Groovy Gramophone", value: "x0.5" });
  }

  if (isTemporaryCollectibleActive({ name: "Tortoise Shrine", game: state })) {
    milliSeconds = milliSeconds * 0.9;
    boostUsed.push({ name: "Tortoise Shrine", value: "x0.9" });
  }

  return {
    milliSeconds: (milliSeconds * seeds.amount) / CROP_MACHINE_PLOTS(state),
    boostUsed,
  };
}

export function getOilTimeInMillis(oil: number, state: GameState) {
  // return the time in milliseconds
  return (oil / OIL_PER_HOUR_CONSUMPTION(state)) * 60 * 60 * 1000;
}

export function getPackSeedLimit({
  state,
  seedName,
}: {
  state: GameState;
  seedName: CropSeedName;
}) {
  const inventoryLimit = INVENTORY_LIMIT(state)[seedName] ?? new Decimal(0);

  return inventoryLimit;
}

export function updateCropMachine({
  cropMachine,
  now,
}: {
  now: number;
  cropMachine: CropMachineBuilding;
}) {
  const queue = cropMachine.queue ?? [];

  queue.forEach((pack, index) => {
    // Skip packs that are already grown or if there's no oil left
    if (!!pack.readyAt || !cropMachine.unallocatedOilTime) {
      return;
    }

    const previousQueueItemReadyAt =
      queue[index - 1]?.readyAt ?? queue[index - 1]?.growsUntil ?? now;

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

export const BASIC_CROP_MACHINE_SEEDS: CropSeedName[] = [
  "Sunflower Seed",
  "Potato Seed",
  "Pumpkin Seed",
];

export const CROP_EXTENSION_MOD_I_SEEDS: CropSeedName[] = [
  "Rhubarb Seed",
  "Zucchini Seed",
];

export const CROP_EXTENSION_MOD_II_SEEDS: CropSeedName[] = [
  "Carrot Seed",
  "Cabbage Seed",
];

export const CROP_EXTENSION_MOD_III_SEEDS: CropSeedName[] = [
  "Yam Seed",
  "Broccoli Seed",
];

export function supplyCropMachine({
  state,
  action,
  createdAt = Date.now(),
}: SupplyCropMachineOptions): GameState {
  const seedsAdded = action.seeds;

  if (seedsAdded.amount < 1) {
    throw new Error("Invalid amount supplied");
  }

  return produce(state, (stateCopy) => {
    if (!stateCopy.buildings["Crop Machine"]) {
      throw new Error("Crop Machine does not exist");
    }

    const cropMachine = stateCopy.buildings["Crop Machine"].find(
      (machine) => machine.id === action.machineId,
    );

    if (!cropMachine || !cropMachine.coordinates) {
      throw new Error("Crop Machine not found");
    }

    const { queue = [] } = cropMachine;
    const seedName = seedsAdded.type;

    // Check if seed is allowed based on basic seeds or skills
    if (
      !BASIC_CROP_MACHINE_SEEDS.includes(seedName) &&
      !(
        state.bumpkin.skills["Crop Extension Module I"] &&
        CROP_EXTENSION_MOD_I_SEEDS.includes(seedName)
      ) &&
      !(
        state.bumpkin.skills["Crop Extension Module II"] &&
        CROP_EXTENSION_MOD_II_SEEDS.includes(seedName)
      ) &&
      !(
        state.bumpkin.skills["Crop Extension Module III"] &&
        CROP_EXTENSION_MOD_III_SEEDS.includes(seedName)
      )
    ) {
      throw new Error("You can't supply these seeds");
    }

    const inventoryLimit = getPackSeedLimit({ state, seedName });

    if (inventoryLimit.lt(seedsAdded.amount)) {
      throw new Error("Can't supply more seeds than the inventory limit");
    }

    const previousSeedsInInventory =
      stateCopy.inventory[seedName] ?? new Decimal(0);

    if (previousSeedsInInventory.lt(seedsAdded.amount)) {
      throw new Error("Missing requirements");
    }

    if (queue.length + 1 > MAX_QUEUE_SIZE(state)) {
      throw new Error("Queue is full");
    }

    stateCopy.inventory[seedName] = previousSeedsInInventory.minus(
      seedsAdded.amount,
    );

    const crop = seedName.split(" ")[0] as CropName;

    const { milliSeconds, boostUsed } = calculateCropTime(seedsAdded, state);

    queue.push({
      seeds: seedsAdded.amount,
      crop,
      growTimeRemaining: milliSeconds,
      totalGrowTime: milliSeconds,
    });
    cropMachine.queue = queue;

    const updatedCropMachine = updateCropMachine({
      now: createdAt,
      cropMachine,
    });

    stateCopy.buildings["Crop Machine"] = stateCopy.buildings[
      "Crop Machine"
    ].map((machine) =>
      machine.id === cropMachine.id ? updatedCropMachine : machine,
    );

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostUsed,
      createdAt,
    });

    return stateCopy;
  });
}
