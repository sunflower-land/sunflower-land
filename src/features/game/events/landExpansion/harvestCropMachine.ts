import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type HarvestCropMachineAction = {
  type: "cropMachine.harvested";
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestCropMachineAction;
  createdAt?: number;
};

export function harvestCropMachine({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);
  const machine = stateCopy.buildings["Crop Machine"]?.[0];

  if (!machine) {
    throw new Error("Crop Machine does not exist");
  }

  if (!machine.queue || machine.queue?.length === 0) {
    throw new Error("Nothing in the queue");
  }

  if (
    !machine.queue?.some((pack) => pack.readyAt && pack.readyAt < createdAt)
  ) {
    throw new Error("There are no crops to collect");
  }

  // Filter out the harvested crops and add them to the player's inventory
  machine.queue = machine.queue.filter((pack) => {
    const cropsInInventory = stateCopy.inventory[pack.crop] ?? new Decimal(0);

    if (pack.readyAt && pack.readyAt <= createdAt) {
      stateCopy.inventory[pack.crop] = cropsInInventory.add(pack.amount);
      return false; // remove pack from queue the queue
    }
    return true; // Keep this pack in the queue if it's not ready
  });

  return stateCopy;
}
