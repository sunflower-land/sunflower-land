import Decimal from "decimal.js-light";
import { CropSeedName } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
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
      const pack = newQueue[i];
      if (pack.startTime === undefined) continue;

      const prev = newQueue[i - 1];
      const previousReadyAt = prev?.readyAt ?? prev?.growsUntil ?? createdAt;
      const newStart = Math.max(previousReadyAt, createdAt);

      pack.startTime = newStart;
      if (pack.readyAt !== undefined) {
        pack.readyAt = newStart + pack.totalGrowTime;
      }
      if (pack.growsUntil !== undefined) {
        const allocatedOil = pack.totalGrowTime - pack.growTimeRemaining;
        pack.growsUntil = newStart + allocatedOil;
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
