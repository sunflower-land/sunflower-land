import Decimal from "decimal.js-light";
import { CropName, CROPS, SeedName } from "../types/crops";
import { GameState, Inventory, InventoryItemName } from "../types/game";

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
];

function isSeed(crop: InventoryItemName): crop is SeedName {
  return VALID_SEEDS.includes(crop);
}

type Options = {
  state: GameState;
  action: PlantAction;
  createdAt?: number;
};

type GetPlantedAtArgs = {
  crop: CropName;
  inventory: Inventory;
  createdAt: number;
};

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
function getPlantedAt({
  crop,
  inventory,
  createdAt,
}: GetPlantedAtArgs): number {
  // 15% speed boost with scarecrow
  if (inventory.Scarecrow?.gte(1)) {
    return createdAt - CROPS()[crop].harvestSeconds * 1000 * 0.15;
  }

  return createdAt;
}

type GetFieldArgs = {
  crop: CropName;
  inventory: Inventory;
};

/**
 * Based on items, the output will be different
 */
function getMultiplier({ crop, inventory }: GetFieldArgs): number {
  let multiplier = 1;
  if (crop === "Cauliflower" && inventory["Golden Cauliflower"]?.gte(1)) {
    multiplier *= 2;
  }

  if (inventory.Scarecrow?.gte(1)) {
    multiplier *= 1.2;
  }

  return multiplier;
}

export function plant({ state, action, createdAt = Date.now() }: Options) {
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
  if (field) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No seed selected");
  }

  if (!isSeed(action.item)) {
    throw new Error("Not a seed");
  }

  const seedCount = state.inventory[action.item] || new Decimal(0);
  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  const newFields = fields;

  const crop = action.item.split(" ")[0] as CropName;

  newFields[action.index] = {
    plantedAt: getPlantedAt({ crop, inventory: state.inventory, createdAt }),
    name: crop,
    multiplier: getMultiplier({ crop, inventory: state.inventory }),
  };

  return {
    ...state,
    inventory: {
      ...state.inventory,
      [action.item]: seedCount.sub(1),
    },
    fields: newFields,
  } as GameState;
}
