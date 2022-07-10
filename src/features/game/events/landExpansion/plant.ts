import Decimal from "decimal.js-light";
import { CropName } from "../../types/crops";
import { GameState, Inventory, InventoryItemName } from "../../types/game";
import { getPlantedAt, isSeed } from "../plant";

export type LandExpansionPlantAction = {
  type: "landExpansion.item.planted";
  item: InventoryItemName;
  index: number;
};

type Options = {
  state: GameState;
  action: LandExpansionPlantAction;
  createdAt?: number;
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

export function plant({ state, action, createdAt = Date.now() }: Options) {
  const plots = { ...state.plots };

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

  const seedCount = state.inventory[action.item] || new Decimal(0);

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

  return {
    ...state,
    plots,
    inventory: {
      ...state.inventory,
      [action.item]: seedCount?.sub(1),
    },
  } as GameState;
}
