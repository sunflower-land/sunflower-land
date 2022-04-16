import { GameState, Inventory } from "../types/game";
import { CROPS } from "../types/crops";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";

export type HarvestAction = {
  type: "item.harvested";
  index: number;
};

type Options = {
  state: GameState;
  action: HarvestAction;
  createdAt?: number;
};

export function harvest({ state, action, createdAt = Date.now() }: Options) {
  const fields = { ...state.fields };

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
