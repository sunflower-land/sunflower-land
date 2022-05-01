import { GameState, Inventory } from "../types/game";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { FLOWERS } from "../types/flowers";

export type HarvestFlowerAction = {
  type: "flower.harvested";
  index: number;
};

type Options = {
  state: GameState;
  action: HarvestFlowerAction;
  createdAt?: number;
};

export function flowerHarvest({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const flowerFields = { ...state.flowerFields };

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
    action.index <= 24 &&
    !state.inventory["Roasted Cauliflower"]
  ) {
    throw new Error("Goblin land!");
  }
 

  const flowerField = flowerFields[action.index];


  if (!flowerField) {
    throw new Error("Nothing was planted");
  }

  const flower = FLOWERS()[flowerField.name];

  if (createdAt - flowerField.plantedAt < flower.harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid harvest");
  }

  const newFlowerFields = flowerFields;
  delete newFlowerFields[action.index];

  const flowerCount = state.inventory[flowerField.name] || new Decimal(0);
  const multiplier = flowerField.multiplier || 1;

  const inventory: Inventory = {
    ...state.inventory,
    [flowerField.name]: flowerCount.add(multiplier),
  };

  return {
    ...state,
    flowerFields: newFlowerFields,
    inventory,
  } as GameState;
}
