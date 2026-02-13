import Decimal from "decimal.js-light";
import { CropMachineQueueItem, GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  getOilTimeInMillis,
  MAX_OIL_CAPACITY_IN_MILLIS,
  updateCropMachine,
} from "./supplyCropMachine";

export function getTotalOilMillisInMachine(
  queue: CropMachineQueueItem[],
  unallocatedOilTime: number,
  now: number,
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

export type SupplyCropMachineOilAction = {
  type: "cropMachine.oilSupplied";
  oil: number;
  machineId: string;
};

type SupplyCropMachineOilOptions = {
  state: Readonly<GameState>;
  action: SupplyCropMachineOilAction;
  createdAt?: number;
};

export function supplyCropMachineOil({
  state,
  action,
  createdAt = Date.now(),
}: SupplyCropMachineOilOptions): GameState {
  const oilAdded = action.oil;

  if (oilAdded <= 0) {
    throw new Error("Invalid amount supplied");
  }

  return produce(state, (stateCopy) => {
    if (
      !stateCopy.buildings["Crop Machine"]?.some(
        (building) => !!building.coordinates,
      )
    ) {
      throw new Error("Crop Machine does not exist");
    }

    const cropMachine = stateCopy.buildings["Crop Machine"].find(
      (m) => m.id === action.machineId,
    );

    if (!cropMachine) {
      throw new Error("Crop Machine not found");
    }
    const { queue = [], unallocatedOilTime = 0 } = cropMachine;

    const previousOilInInventory = stateCopy.inventory["Oil"] ?? new Decimal(0);

    if (previousOilInInventory.lt(oilAdded)) {
      throw new Error("Missing requirements");
    }

    const oilMillisInMachine = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime,
      createdAt,
    );

    if (
      oilMillisInMachine + getOilTimeInMillis(oilAdded, state) >
      MAX_OIL_CAPACITY_IN_MILLIS(state)
    ) {
      throw new Error("Oil capacity exceeded");
    }

    stateCopy.inventory["Oil"] = previousOilInInventory.minus(oilAdded);

    cropMachine.unallocatedOilTime =
      (cropMachine.unallocatedOilTime ?? 0) +
      getOilTimeInMillis(oilAdded, state);

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
