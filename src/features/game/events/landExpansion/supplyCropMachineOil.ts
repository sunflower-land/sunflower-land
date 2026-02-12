import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  getTotalOilMillisInMachine,
  getOilTimeInMillis,
  MAX_OIL_CAPACITY_IN_MILLIS,
  updateCropMachine,
} from "./supplyCropMachine";

export type SupplyCropMachineOilAction = {
  type: "cropMachine.oilSupplied";
  oil: number;
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

    const cropMachine = stateCopy.buildings["Crop Machine"][0];
    const { queue = [], unallocatedOilTime = 0 } = cropMachine;

    const previousOilInInventory = stateCopy.inventory["Oil"] ?? new Decimal(0);

    if (previousOilInInventory.lt(oilAdded)) {
      throw new Error("Missing requirements");
    }

    const oilMillisInMachine = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime,
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

    stateCopy.buildings["Crop Machine"][0] = updateCropMachine({
      now: createdAt,
      state: stateCopy,
    });

    return stateCopy;
  });
}
