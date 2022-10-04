import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { CropName, CROPS } from "../../types/crops";
import { GameState, Inventory, InventoryItemName } from "../../types/game";
import { getPlantedAt, isSeed } from "../plant";
import { PLANT_STAMINA_COST } from "features/game/lib/constants";
import { replenishStamina } from "./replenishStamina";
import { getKeys } from "features/game/types/craftables";
import { BumpkinSkillName } from "features/game/types/bumpkinSkills";

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
  skills: Partial<Record<BumpkinSkillName, number>>
) => {
  let seconds = CROPS()[crop].harvestSeconds;

  if (inventory["Seed Specialist"]?.gte(1)) {
    seconds = seconds * 0.9;
  }

  if (crop === "Parsnip" && inventory["Mysterious Parsnip"]?.gte(1)) {
    seconds = seconds * 0.5;
  }

  if (crop === "Carrot" && inventory["Carrot Amulet"]?.gte(1)) {
    seconds = seconds * 0.8;
  }

  // Scarecrow: 15% reduction
  if (
    inventory.Nancy?.greaterThanOrEqualTo(1) ||
    inventory.Scarecrow?.greaterThanOrEqualTo(1) ||
    inventory.Kuebiko?.greaterThanOrEqualTo(1)
  ) {
    seconds = seconds * 0.85;
  }

  if (skills["Cultivator"]) {
    seconds = seconds * 0.95;
  }

  return seconds;
};

/**
 * Based on items, the output will be different
 */
export function getCropYieldAmount({
  crop,
  inventory,
}: {
  crop: CropName;
  inventory: Inventory;
}): number {
  let amount = 1;

  if (crop === "Cauliflower" && inventory["Golden Cauliflower"]?.gte(1)) {
    amount *= 2;
  }

  if (crop === "Carrot" && inventory["Easter Bunny"]?.gte(1)) {
    amount *= 1.2;
  }

  if (inventory.Scarecrow?.gte(1) || inventory.Kuebiko?.gte(1)) {
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
  const { expansions, bumpkin, inventory } = stateCopy;
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

  const seedCount = stateCopy.inventory[action.item] || new Decimal(0);

  if (seedCount.lessThan(1)) {
    throw new Error("Not enough seeds");
  }

  const cropName = action.item.split(" ")[0] as CropName;

  plots[action.index] = {
    ...plot,
    crop: {
      plantedAt: getPlantedAt({
        crop: cropName,
        inventory: state.inventory,
        createdAt,
      }),
      name: cropName,
      amount: getCropYieldAmount({
        crop: cropName,
        inventory: state.inventory,
      }),
    },
  };

  expansion.plots = plots;

  let staminaCost = PLANT_STAMINA_COST;

  if (bumpkin.skills["Plant Whisperer"]) {
    staminaCost = staminaCost * 0.9;
  }

  bumpkin.stamina.value -= staminaCost;

  stateCopy.inventory[action.item] = seedCount.sub(1);

  return stateCopy;
}
