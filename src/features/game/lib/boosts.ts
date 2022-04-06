import { Inventory, InventoryItemName } from "../types/game";
import { Crop } from "../types/crops";
import { isSeed } from "../events/plant";

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
 * To be used as boolean flag
 * Update if more upcoming boosts
 */
export const hasSellBoost = (inventory: Inventory) => {
  return inventory["Green Thumb"]?.greaterThanOrEqualTo(1) || false;
};

type HasBoostArgs = {
  item: InventoryItemName;
  inventory: Inventory;
};
/**
 * To be used as boolean flag
 * Update if more upcoming boosts
 */
export const hasBoost = ({ item, inventory }: HasBoostArgs) => {
  if (
    isSeed(item) &&
    (inventory.Nancy?.greaterThanOrEqualTo(1) ||
      inventory.Scarecrow?.greaterThanOrEqualTo(1) ||
      inventory.Kuebiko?.greaterThanOrEqualTo(1))
  ) {
    return true;
  }

  if (
    item === "Carrot Seed" &&
    inventory["Carrot Sword"]?.greaterThanOrEqualTo(1)
  ) {
    return true;
  }

  if (
    item === "Parsnip Seed" &&
    inventory["Mysterious Parsnip"]?.greaterThanOrEqualTo(1)
  ) {
    return true;
  }

  if (
    item === "Parsnip Seed" &&
    inventory["Mysterious Parsnip"]?.greaterThanOrEqualTo(1)
  ) {
    return true;
  }

  if (
    item === "Cauliflower Seed" &&
    inventory["Golden Cauliflower"]?.greaterThanOrEqualTo(1)
  ) {
    return true;
  }

  return false;
};
