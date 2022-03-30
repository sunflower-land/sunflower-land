import { Inventory } from "../types/game";
import { Crop } from "../types/crops";

/**
 * How much SFL a crop is worth
 */
export const getSellPrice = (crop: Crop, inventory: Inventory) => {
  let price = crop.sellPrice;

  if (inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    price = price.mul(1.05);
  
  return price;
};
  
