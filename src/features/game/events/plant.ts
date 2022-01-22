import { CropName, SeedName } from "../types/crops";
import { GameState, InventoryItemName } from "../types/game";

export type PlantAction = {
  type: "item.planted";
  item?: InventoryItemName;
  index: number;
};

// Seeds which are implemented
const VALID_SEEDS: InventoryItemName[] = [
  "Sunflower Seed",
  "Potato Seed",
  "Beetroot Seed",
  "Cabbage Seed",
  "Carrot Seed",
  "Cauliflower Seed",
  "Pumpkin Seed",
  "Parsnip Seed",
  "Radish Seed",
  "Wheat Seed",
];

function isSeed(crop: InventoryItemName): crop is SeedName {
  return VALID_SEEDS.includes(crop);
}

export function plant(state: GameState, action: PlantAction) {
  const fields = state.fields;

  if (action.index > 4 && !state.inventory["Pumpkin Soup"]) {
    throw new Error("Goblin land!");
  }

  const field = fields[action.index];
  if (field.crop) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No seed selected");
  }

  if (!isSeed(action.item)) {
    throw new Error("Not a seed");
  }

  const seedCount = state.inventory[action.item] || 0;
  if (seedCount === 0) {
    throw new Error("Not enough seeds");
  }

  const newFields = fields;

  const crop = action.item.split(" ")[0] as CropName;

  newFields[action.index] = {
    ...newFields[action.index],
    crop: {
      plantedAt: new Date(),
      name: crop,
    },
  };

  return {
    ...state,
    inventory: {
      ...state.inventory,
      [action.item]: seedCount - 1,
    },
    fields: newFields,
  } as GameState;
}
