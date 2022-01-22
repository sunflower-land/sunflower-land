import { GameState } from "../types/game";
import { CROPS } from "../types/crops";

export type HarvestAction = {
  type: "item.harvested";
  index: number;
};

export function harvest(state: GameState, action: HarvestAction) {
  const fields = state.fields;

  if (fields.length < action.index) {
    throw new Error("Field is not unlocked");
  }

  const field = fields[action.index];
  if (!field.crop) {
    throw new Error("Nothing was planted");
  }

  const crop = CROPS[field.crop.name];

  if (
    Date.now() - field.crop.plantedAt.getTime() <
    crop.harvestSeconds * 1000
  ) {
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
