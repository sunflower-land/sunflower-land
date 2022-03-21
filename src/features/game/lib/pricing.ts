import { Inventory } from "../types/game";
import { Crop } from "../types/crops";

/**
 * TODO
 *  - find better way to check inventory w/o passing it each time
 *  - add more conditions
 */
export const getSellPrice = (crop: Crop, inventory: Inventory) => {
  if (
    crop.name === "Cauliflower" &&
    inventory["Golden Cauliflower"]?.greaterThanOrEqualTo(1)
  ) {
    return crop.sellPrice.mul(2);
  }

  return crop.sellPrice;
};
