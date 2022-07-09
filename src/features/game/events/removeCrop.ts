import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { CROPS } from "../types/crops";
import { GameState, InventoryItemName } from "../types/game";
import { isReadyToHarvest, isShovelStolen } from "./harvest";

export enum REMOVE_CROP_ERRORS {
  SHOVEL_STOLEN = "Shovel stolen!",
  NO_SHOVEL_SELECTED = "No shovel selected!",
  NO_SHOVEL_AVAILABLE = "No shovel available!",
  FIELD_DOESNT_EXIST = "Field doesn't exist!",
  LOCKED_LAND = "Goblin land!",
  NO_CROP_PLANTED = "There is no crop planted!",
  READY_TO_HARVEST = "Plant is ready to harvest!",
  INVALID_PLANT = "Invalid Plant!",
}

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
    throw new Error(REMOVE_CROP_ERRORS.SHOVEL_STOLEN);
  }

  if (action.item !== "Rusty Shovel") {
    throw new Error(REMOVE_CROP_ERRORS.NO_SHOVEL_SELECTED);
  }

  const shovelAmount = state.inventory["Rusty Shovel"] || new Decimal(0);
  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
  }

  if (action.index < 0) {
    throw new Error(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  }

  if (!Number.isInteger(action.index)) {
    throw new Error(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  }

  if (
    action.index >= 5 &&
    action.index <= 9 &&
    !state.inventory["Pumpkin Soup"]
  ) {
    throw new Error(REMOVE_CROP_ERRORS.LOCKED_LAND);
  }

  if (
    action.index >= 10 &&
    action.index <= 15 &&
    !state.inventory["Sauerkraut"]
  ) {
    throw new Error(REMOVE_CROP_ERRORS.LOCKED_LAND);
  }

  if (
    action.index >= 16 &&
    action.index <= 21 &&
    !state.inventory["Roasted Cauliflower"]
  ) {
    throw new Error(REMOVE_CROP_ERRORS.LOCKED_LAND);
  }

  if (action.index > 21) {
    throw new Error(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  }

  const field = fields[action.index];
  if (!field) {
    throw new Error(REMOVE_CROP_ERRORS.NO_CROP_PLANTED);
  }

  const crop = CROPS()[field.name];

  if (isReadyToHarvest(createdAt, field, crop)) {
    throw new Error(REMOVE_CROP_ERRORS.READY_TO_HARVEST);
  }

  if (!screenTracker.calculate()) {
    throw new Error(REMOVE_CROP_ERRORS.INVALID_PLANT);
  }

  const newFields = fields;

  delete newFields[action.index];

  return {
    ...state,
    fields: newFields,
  } as GameState;
}
