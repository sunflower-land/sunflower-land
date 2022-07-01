import { screenTracker } from "lib/utils/screen";
import { CROPS } from "../types/crops";
import { GameState, InventoryItemName } from "../types/game";
import { isReadyToHarvest, isShovelStolen } from "./harvest";

export type RemoveCropAction = {
  type: "item.removed";
  item?: InventoryItemName;
  index: number;
};

type Options = {
  state: GameState;
  action: RemoveCropAction;
  createdAt?: number;
};

export function removeCrop({ state, action, createdAt = Date.now() }: Options) {
  const fields = { ...state.fields };

  if (isShovelStolen()) {
    throw new Error("Missing shovel!");
  }

  if (action.index < 0) {
    throw new Error("Field does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  if (
    action.index >= 5 &&
    action.index <= 9 &&
    !state.inventory["Pumpkin Soup"]
  ) {
    throw new Error("Goblin land!");
  }

  if (
    action.index >= 10 &&
    action.index <= 15 &&
    !state.inventory["Sauerkraut"]
  ) {
    throw new Error("Goblin land!");
  }

  if (
    action.index >= 16 &&
    action.index <= 21 &&
    !state.inventory["Roasted Cauliflower"]
  ) {
    throw new Error("Goblin land!");
  }

  if (action.index > 21) {
    throw new Error("Field does not exist");
  }

  const field = fields[action.index];
  if (!field) {
    throw new Error("There is no crop planted");
  }

  const crop = CROPS()[field.name];

  if (isReadyToHarvest(createdAt, field, crop)) {
    throw new Error("Plant is ready to harvest");
  }

  // TODO - Check this if it makes sense for removing crops
  if (!screenTracker.calculate()) {
    throw new Error("Invalid plant");
  }

  const newFields = fields;

  delete newFields[action.index];

  return {
    ...state,
    fields: newFields,
  } as GameState;
}
