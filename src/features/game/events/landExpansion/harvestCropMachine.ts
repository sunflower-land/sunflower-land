import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type HarvestCropMachineAction = {
  type: "cropMachine.harvested";
  packIndex: number;
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
  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin does not exist");
  }

  if (!machine) {
    throw new Error("Crop Machine does not exist");
  }

  if (!machine.queue || machine.queue?.length === 0) {
    throw new Error("Nothing in the queue");
  }

  if (!machine.queue[action.packIndex]) {
    throw new Error("Pack does not exist");
  }

  const pack = machine.queue[action.packIndex];

  if (!pack.readyAt || (pack.readyAt && pack.readyAt > createdAt)) {
    throw new Error("The pack is not ready yet");
  }

  // Harvest the crops from pack
  const cropsInInventory = stateCopy.inventory[pack.crop] ?? new Decimal(0);
  stateCopy.inventory[pack.crop] = cropsInInventory.add(pack.amount);
  bumpkin.activity = trackActivity(
    `${pack.crop} Harvested`,
    bumpkin.activity,
    new Decimal(pack.seeds)
  );

  // Filter out the harvested crops and add them to the player's inventory
  machine.queue = machine.queue.filter(
    (_, index) => index !== action.packIndex
  );

  return stateCopy;
}
