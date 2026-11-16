import Decimal from "decimal.js-light";
import type { CropSeedName } from "features/game/types/crops";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import { convertLegacyCropMachine } from "./supplyCropMachine";
import { getCropMachineBoostWindows } from "features/game/lib/boostWindows";
import {
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

    const windows = getCropMachineBoostWindows(stateCopy);
    convertLegacyCropMachine({
      machine: cropMachine,
      state: stateCopy,
      windows,
      now: createdAt,
    });
    settleCropMachine({ machine: cropMachine, windows, now: createdAt });

    // Started-check on the DERIVED timeline: after settling, a pack the
    // fuel has reached starts at (or before) `createdAt`; only packs still
    // queued behind others or unfunded are removable. A finalised pack (no
    // marker) has certainly started.
    //
    // The derived start is not sufficient on its own: `resolveCropMachine`
    // gives a pack it cannot fund no `startsAt` at all, so a pack that grew
    // for a while and then STALLED with a dry tank would read as
    // never-started and be removable for a full seed refund. Its stamped
    // `startTime` survives settlement precisely because a past start is
    // history (see `refreshCropMachineCaches`), so check it too.
    const timing = resolveCropMachine({ machine: cropMachine, windows }).packs[
      action.packIndex
    ];
    if (
      pack.baseDurationMs === undefined ||
      (pack.startTime !== undefined && pack.startTime <= createdAt) ||
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

    return stateCopy;
  });
}
