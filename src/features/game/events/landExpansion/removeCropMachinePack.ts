import Decimal from "decimal.js-light";
import { CropSeedName } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { updateCropMachine } from "./supplyCropMachine";

export type RemoveCropMachinePackAction = {
  type: "cropMachine.packRemoved";
  packIndex: number;
  machineId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCropMachinePackAction;
  createdAt?: number;
};

export function removeCropMachinePack({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (!hasFeatureAccess(state, "CROP_MACHINE_PACK_REMOVAL")) {
    throw new Error("Crop Machine Pack Removal is not available");
  }

  return produce(state, (stateCopy) => {
    if (
      !stateCopy.buildings["Crop Machine"]?.some(
        (building) => !!building.coordinates,
      )
    ) {
      throw new Error("Crop Machine does not exist");
    }
    const cropMachine = stateCopy.buildings["Crop Machine"]?.find(
      (m) => m.id === action.machineId,
    );

    if (!cropMachine) {
      throw new Error("Crop Machine does not exist");
    }

    if (!cropMachine.queue || cropMachine.queue.length === 0) {
      throw new Error("Nothing in the queue");
    }

    if (!cropMachine.queue[action.packIndex]) {
      throw new Error("Pack does not exist");
    }

    const pack = cropMachine.queue[action.packIndex];

    if (pack.startTime !== undefined && pack.startTime <= createdAt) {
      throw new Error("Pack has already started");
    }

    // Refund seeds to inventory
    const seedName: CropSeedName = `${pack.crop} Seed`;
    const seedsInInventory = stateCopy.inventory[seedName] ?? new Decimal(0);
    stateCopy.inventory[seedName] = seedsInInventory.add(pack.seeds);

    // Refund allocated oil if pack was scheduled
    let allocatedOil = 0;
    if (pack.startTime !== undefined && pack.startTime > createdAt) {
      allocatedOil = pack.totalGrowTime - pack.growTimeRemaining;
      cropMachine.unallocatedOilTime =
        (cropMachine.unallocatedOilTime ?? 0) + allocatedOil;
    }

    // Remove pack from queue
    cropMachine.queue = cropMachine.queue.filter(
      (_, index) => index !== action.packIndex,
    );

    // Reschedule downstream packs: their startTime/readyAt/growsUntil were
    // based on the removed pack's schedule and must be recalculated.
    const newQueue = cropMachine.queue;
    for (let i = action.packIndex; i < newQueue.length; i++) {
      const p = newQueue[i];
      if (p.startTime === undefined) continue;

      const prev = newQueue[i - 1];
      const previousReadyAt = prev?.readyAt ?? prev?.growsUntil ?? createdAt;
      const newStart = Math.max(previousReadyAt, createdAt);

      p.startTime = newStart;
      if (p.readyAt !== undefined) {
        p.readyAt = newStart + p.totalGrowTime;
      }
      if (p.growsUntil !== undefined) {
        const allocatedOil = p.totalGrowTime - p.growTimeRemaining;
        p.growsUntil = newStart + allocatedOil;
      }
    }

    const updatedCropMachine = updateCropMachine({
      now: createdAt,
      cropMachine,
    });

    stateCopy.buildings["Crop Machine"] = stateCopy.buildings[
      "Crop Machine"
    ].map((machine) =>
      machine.id === cropMachine.id ? updatedCropMachine : machine,
    );

    return stateCopy;
  });
}
