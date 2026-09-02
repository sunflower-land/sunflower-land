import Decimal from "decimal.js-light";
import type { CropSeedName } from "features/game/types/crops";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import { updateCropMachine } from "./supplyCropMachine";
import { hasFeatureAccess } from "lib/flags";
import { getCropMachineBoostWindows } from "features/game/lib/boostWindows";
import {
  convertCropMachineToWindowed,
  refreshCropMachineCaches,
  resolveCropMachine,
  settleCropMachine,
} from "features/game/lib/cropMachineReadiness";

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

    const windowed =
      cropMachine.oilSettledAt !== undefined ||
      hasFeatureAccess(stateCopy, "SPEED_BOOSTS");

    if (windowed) {
      const windows = getCropMachineBoostWindows(stateCopy);
      convertCropMachineToWindowed({
        machine: cropMachine,
        windows,
        now: createdAt,
      });
      settleCropMachine({ machine: cropMachine, windows, now: createdAt });

      // Started-check on the DERIVED timeline: after settling, a pack the
      // fuel has reached starts at (or before) `createdAt`; only packs still
      // queued behind others or unfunded are removable. A finalised pack (no
      // marker) has certainly started.
      const timing = resolveCropMachine({ machine: cropMachine, windows })
        .packs[action.packIndex];
      if (
        pack.baseDurationMs === undefined ||
        (timing.startsAt !== undefined && timing.startsAt <= createdAt)
      ) {
        throw new Error("Pack has already started");
      }

      // Refund seeds to inventory
      const seedName: CropSeedName = `${pack.crop} Seed`;
      const seedsInInventory = stateCopy.inventory[seedName] ?? new Decimal(0);
      stateCopy.inventory[seedName] = seedsInInventory.add(pack.seeds);

      // No oil to refund: on a windowed machine fuel carries no per-pack
      // earmarks, and an unstarted pack has burned nothing. Removing it needs
      // no hand-rolled rescheduling either — the resolver re-chains whatever
      // was queued behind it.
      cropMachine.queue = cropMachine.queue.filter(
        (_, index) => index !== action.packIndex,
      );

      refreshCropMachineCaches({
        machine: cropMachine,
        windows,
        now: createdAt,
      });

      return;
    }

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
