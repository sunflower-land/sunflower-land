import { FieldItem, GameState, Inventory } from "../types/game";
import { Crop, CROPS } from "../types/crops";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import cloneDeep from "lodash.clonedeep";

export type HarvestAction = {
  type: "item.harvested";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestAction;
  createdAt?: number;
};

export function isReadyToHarvest(
  createdAt: number,
  field: FieldItem,
  crop: Crop
) {
  return createdAt - field.plantedAt >= crop.harvestSeconds * 1000;
}

export function harvest({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const fields = { ...stateCopy.fields };

  if (action.index < 0) {
    throw new Error("Field does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  if (
    action.index >= 5 &&
    action.index <= 9 &&
    !stateCopy.inventory["Pumpkin Soup"]
  ) {
    throw new Error("Goblin land!");
  }

  if (
    action.index >= 10 &&
    action.index <= 15 &&
    !stateCopy.inventory["Sauerkraut"]
  ) {
    throw new Error("Goblin land!");
  }

  if (
    action.index >= 16 &&
    action.index <= 21 &&
    !stateCopy.inventory["Roasted Cauliflower"]
  ) {
    throw new Error("Goblin land!");
  }

  if (action.index > 21) {
    throw new Error("Field does not exist");
  }

  const field = fields[action.index];

  if (!field) {
    throw new Error("Nothing was planted");
  }

  const crop = CROPS()[field.name];

  if (!isReadyToHarvest(createdAt, field, crop)) {
    throw new Error("Not ready");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid harvest");
  }

  const newFields = fields;
  delete newFields[action.index];

  const cropCount = stateCopy.inventory[field.name] || new Decimal(0);
  const multiplier = field.multiplier || 1;

  const inventory: Inventory = {
    ...stateCopy.inventory,
    [field.name]: cropCount.add(multiplier),
  };

  return {
    ...stateCopy,
    fields: newFields,
    inventory,
  } as GameState;
}
