import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import cloneDeep from "lodash.clonedeep";
import { CROPS } from "../types/crops";
import { GameState, InventoryItemName } from "../types/game";
import { isReadyToHarvest } from "./harvest";

export enum REMOVE_CROP_ERRORS {
  SHOVEL_STOLEN = "Shovel stolen!",
  NO_VALID_SHOVEL_SELECTED = "No valid shovel selected!",
  NO_SHOVEL_AVAILABLE = "No shovel available!",
  FIELD_DOESNT_EXIST = "Field doesn't exist!",
  NO_CROP_PLANTED = "There is no crop planted!",
  READY_TO_HARVEST = "Plant is ready to harvest!",
  INVALID_PLANT = "Invalid Plant!",
}

export type RemoveCropAction = {
  type: "item.removed";
  item?: InventoryItemName;
  fieldIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCropAction;
  createdAt?: number;
};

export function removeCrop({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const { fields } = stateCopy;

  if (action.item !== "Shovel") {
    throw new Error(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  }

  const shovelAmount = stateCopy.inventory.Shovel || new Decimal(0);
  if (shovelAmount.lessThan(1)) {
    throw new Error(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
  }

  if (action.fieldIndex < 0) {
    throw new Error(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  }

  if (!Number.isInteger(action.fieldIndex)) {
    throw new Error(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  }

  if (action.fieldIndex > 21) {
    throw new Error(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  }

  const field = fields[action.fieldIndex];
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

  delete fields[action.fieldIndex];

  return {
    ...stateCopy,
    fields,
  } as GameState;
}
