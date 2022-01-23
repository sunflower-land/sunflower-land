import { GameState } from "../types/game";
import { CROPS } from "../types/crops";

export type HarvestAction = {
  type: "item.harvested";
  index: number;
};

export function harvest(state: GameState, action: HarvestAction) {
  const fields = state.fields;

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
    !state.inventory["Cabbage Soup"]
  ) {
    throw new Error("Goblin land!");
  }

  if (
    action.index >= 16 &&
    action.index <= 21 &&
    !state.inventory["Cauliflower Rice"]
  ) {
    throw new Error("Goblin land!");
  }

  if (fields.length < action.index) {
    throw new Error("Field is not unlocked");
  }

  const field = fields[action.index];
  if (!field.crop) {
    throw new Error("Nothing was planted");
  }

  const crop = CROPS[field.crop.name];

  if (Date.now() - field.crop.plantedAt < crop.harvestSeconds * 1000) {
    throw new Error("Crop is not ready to harvest");
  }

  const newFields = fields;
  newFields[action.index] = {
    ...newFields[action.index],
    crop: undefined,
  };

  const cropCount = state.inventory[field.crop.name] || 0;

  return {
    ...state,
    fields: newFields,
    inventory: {
      ...state.inventory,
      [field.crop.name]: cropCount + 1,
    },
  } as GameState;
}
