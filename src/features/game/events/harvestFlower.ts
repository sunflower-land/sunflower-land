import { GameState, Inventory, InventoryItemName } from "../types/game";
import { CROPS } from "../types/crops";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";

export type HarvestFlowerAction = {
  item?: InventoryItemName;
  type: "flower.chopped";
  index: number;
};

type Options = {
  state: GameState;
  action: HarvestFlowerAction;
  createdAt?: number;
};

const randomSeed = () => {
  const rand = Math.floor(Math.random() * 10);
  if (rand == 9) {
    return 3;
  } else {
    return 0;
  }
};

export function flowerHarvest({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const fields = { ...state.fields };

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  if (action.index > 24) {
    throw new Error("Field does not exist");
  }

  const field = fields[action.index];
  if (!field) {
    throw new Error("Nothing was planted");
  }

  const crop = CROPS()[field.name];

  if (createdAt - field.plantedAt < crop.harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid harvest");
  }

  const newFields = fields;
  delete newFields[action.index];

  const cropCount = state.inventory[field.name] || new Decimal(0);
  const seedCount = state.inventory[`${field.name} Seed`] || new Decimal(0);
  const redSedcount = state.inventory["Red-Flower Seed"] || new Decimal(0);
  const multiplier = field.multiplier || 1;

  const inventory: Inventory = {
    ...state.inventory,
    [field.name]: cropCount.add(multiplier),
  };

  return {
    ...state,
    fields: newFields,
    inventory,
  } as GameState;
}
