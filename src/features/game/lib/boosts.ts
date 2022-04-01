import { Inventory } from "../types/game";
import { Crop } from "../types/crops";

/**
 * How much SFL a crop is worth
 */
export const getSellPrice = (crop: Crop, inventory: Inventory) => {
  let price = crop.sellPrice;

  if (inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    price = price.mul(1.05);
  }

  return price;
};

/**
 * Reduced plant time
 * Update if more upcoming boosts
 */
export const getReducedPlantTime = (seconds: number, inventory: Inventory) => {
  // Scarecrow: 15% reduction
  if (inventory.Scarecrow?.greaterThanOrEqualTo(1)) return seconds * 0.85;

  return seconds;
};

/**
 * To be used as boolean flag
 * Update if more upcoming boosts
 */
export const hasTimeBoost = (inventory: Inventory) => {
  return inventory.Scarecrow?.greaterThanOrEqualTo(1) || false;
};
