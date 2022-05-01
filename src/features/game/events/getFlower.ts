import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { FlowerName, FLOWERS, FlowerSeedName } from "../types/flowers";
import { GameState, Inventory, InventoryItemName } from "../types/game";

export type FlowerAction = {
  type: "flower.planted";
  item?: InventoryItemName;
  index: number;
};

// Seeds which are implemented
const VALID_SEEDS: InventoryItemName[] = [
  "White Flower Seed",
  "Blue Flower Seed",
];

export function isFlowerSeed(flower: InventoryItemName): flower is FlowerSeedName {
  return VALID_SEEDS.includes(flower);
}

type Options = {
  state: GameState;
  action: FlowerAction;
  createdAt?: number;
};

type GetPlantedAtArgs = {
  flower: FlowerName;
  inventory: Inventory;
  createdAt: number;
};

/**
 * Based on boosts, how long a crop will take
 */
export const getFlowerTime = (flower: FlowerName, inventory: Inventory) => {
  let seconds = FLOWERS()[flower].harvestSeconds;

  if (inventory["Seed Specialist"]?.gte(1)) {
    seconds = seconds * 0.9;
  }

  if (flower === "Blue Flower" && inventory["Mysterious Parsnip"]?.gte(1)) {
    seconds = seconds * 0.5;
  }

  // Scarecrow: 15% reduction
  if (
    inventory.Nancy?.greaterThanOrEqualTo(1) ||
    inventory.Scarecrow?.greaterThanOrEqualTo(1) ||
    inventory.Kuebiko?.greaterThanOrEqualTo(1)
  ) {
    seconds = seconds * 0.85;
  }

  return seconds;
};

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
function getPlantedAt({
  flower,
  inventory,
  createdAt,
}: GetPlantedAtArgs): number {
  const flowerTime = FLOWERS()[flower].harvestSeconds;
  const boostedTime = getFlowerTime(flower, inventory);

  const offset = flowerTime - boostedTime;

  return createdAt - offset * 1000;
}

type GetFieldArgs = {
  flower: FlowerName;
  inventory: Inventory;
};

/**
 * Based on items, the output will be different
 */
function getMultiplier({ flower, inventory }: GetFieldArgs): number {
  let multiplier = 1;

  if (inventory.Scarecrow?.gte(1) || inventory.Kuebiko?.gte(1)) {
    multiplier *= 1.2;
  }

  return multiplier;
}

export function plantFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const flowerFields = { ...state.flowerFields };

  if (action.index < 0) {
    throw new Error("Field does not exist");
  }

 

 

  const flowerField = flowerFields[action.index];
  if (flowerField) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No seed selected");
  }

  if (!isFlowerSeed(action.item)) {
    throw new Error("Not a seed");
  }

  const seedCount = state.inventory[action.item] || new Decimal(0);
  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid plant");
  }

  const newFlowerFields = flowerFields;

  const flower = action.item.split(" ")[0] as FlowerName;

  newFlowerFields[action.index] = {
    plantedAt: getPlantedAt({ flower, inventory: state.inventory, createdAt }),
    name: flower,
    multiplier: getMultiplier({ flower, inventory: state.inventory }),
  };

  return {
    ...state,
    inventory: {
      ...state.inventory,
      [action.item]: seedCount.sub(1),
    },
    flowerFields: newFlowerFields,
  } as GameState;
}
