import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { CropName, CROPS } from "../../types/crops";
import {
  Bumpkin,
  Collectibles,
  GameState,
  Inventory,
  InventoryItemName,
} from "../../types/game";
import { isSeed } from "../plant";
import { PLANT_STAMINA_COST } from "features/game/lib/constants";
import { replenishStamina } from "./replenishStamina";
import { getKeys } from "features/game/types/craftables";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

export type LandExpansionPlantAction = {
  type: "seed.planted";
  item: InventoryItemName;
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionPlantAction;
  createdAt?: number;
};

type IsPlotFertile = {
  plotIndex: number;
  expansionIndex: number;
  gameState: GameState;
};
export function isPlotFertile({
  plotIndex,
  expansionIndex,
  gameState,
}: IsPlotFertile): boolean {
  // Get the well count
  const wellCount = gameState.buildings["Water Well"]?.length ?? 0;
  const cropsWellCanWater = wellCount * 10 + 10;

  const cropPosition = gameState.expansions.reduce(
    (count, expansion, index) => {
      if (index < expansionIndex) {
        return count + getKeys(expansion.plots || {}).length;
      }

      if (index === expansionIndex) {
        return count + (plotIndex + 1);
      }

      return count;
    },
    0
  );

  return cropPosition <= cropsWellCanWater;
}

/**
 * Based on boosts, how long a crop will take
 */
export const getCropTime = (
  crop: CropName,
  inventory: Inventory,
  collectibles: Collectibles,
  bumpkin: Bumpkin
) => {
  const { skills, equipped } = bumpkin;
  const { necklace } = equipped;

  let seconds = CROPS()[crop].harvestSeconds;

  if (inventory["Seed Specialist"]?.gte(1)) {
    seconds = seconds * 0.9;
  }

  if (
    crop === "Parsnip" &&
    isCollectibleBuilt("Mysterious Parsnip", collectibles)
  ) {
    seconds = seconds * 0.5;
  }

  if (crop === "Carrot" && necklace === "Carrot Amulet") {
    seconds = seconds * 0.8;
  }

  // Scarecrow: 15% reduction
  if (
    isCollectibleBuilt("Nancy", collectibles) ||
    isCollectibleBuilt("Scarecrow", collectibles) ||
    isCollectibleBuilt("Kuebiko", collectibles)
  ) {
    seconds = seconds * 0.85;
  }

  if (skills["Cultivator"]) {
    seconds = seconds * 0.95;
  }

  return seconds;
};

type GetPlantedAtArgs = {
  crop: CropName;
  inventory: Inventory;
  collectibles: Collectibles;
  bumpkin: Bumpkin;
  createdAt: number;
};

/**
 * Set a plantedAt in the past to make a crop grow faster
 */
export function getPlantedAt({
  crop,
  inventory,
  collectibles,
  bumpkin,
  createdAt,
}: GetPlantedAtArgs): number {
  const cropTime = CROPS()[crop].harvestSeconds;
  const boostedTime = getCropTime(crop, inventory, collectibles, bumpkin);

  const offset = cropTime - boostedTime;

  return createdAt - offset * 1000;
}

export function getStaminaCost(bumpkin: Bumpkin) {
  let staminaCost = PLANT_STAMINA_COST;

  if (bumpkin.skills["Plant Whisperer"]) {
    staminaCost = staminaCost * 0.9;
  }

  return staminaCost;
}
/**
 * Based on items, the output will be different
 */
export function getCropYieldAmount({
  crop,
  inventory,
  collectibles,
}: {
  crop: CropName;
  inventory: Inventory;
  collectibles: Collectibles;
}): number {
  let amount = 1;

  if (
    crop === "Cauliflower" &&
    isCollectibleBuilt("Golden Cauliflower", collectibles)
  ) {
    amount *= 2;
  }

  if (crop === "Carrot" && isCollectibleBuilt("Easter Bunny", collectibles)) {
    amount *= 1.2;
  }

  if (
    isCollectibleBuilt("Scarecrow", collectibles) ||
    isCollectibleBuilt("Kuebiko", collectibles)
  ) {
    amount *= 1.2;
  }

  if (inventory.Coder?.gte(1)) {
    amount *= 1.2;
  }

  return amount;
}

export function plant({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const replenishedState = replenishStamina({
    state,
    action: { type: "bumpkin.replenishStamina" },
    createdAt,
  });

  const stateCopy = cloneDeep(replenishedState);
  const { expansions, bumpkin, collectibles, inventory } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  if (!expansion.plots) {
    throw new Error("Expansion does not have any plots");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.stamina.value < PLANT_STAMINA_COST) {
    throw new Error("You do not have enough stamina");
  }

  const { plots } = expansion;

  if (action.index < 0) {
    throw new Error("Plot does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Plot does not exist");
  }

  if (action.index >= Object.keys(plots).length) {
    throw new Error("Plot does not exist");
  }

  const plot = plots[action.index];

  if (plot.crop?.plantedAt) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No seed selected");
  }

  if (!isSeed(action.item)) {
    throw new Error("Not a seed");
  }

  const seedCount = inventory[action.item] || new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  const cropName = action.item.split(" ")[0] as CropName;

  plots[action.index] = {
    ...plot,
    crop: {
      plantedAt: getPlantedAt({
        crop: cropName,
        inventory,
        collectibles,
        bumpkin,
        createdAt,
      }),
      name: cropName,
      amount: getCropYieldAmount({
        crop: cropName,
        inventory: inventory,
        collectibles,
      }),
    },
  };

  expansion.plots = plots;

  bumpkin.stamina.value -= getStaminaCost(bumpkin);

  inventory[action.item] = seedCount.sub(1);

  return stateCopy;
}
