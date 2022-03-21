import { Inventory } from "../types/game";
import { Crop } from "../types/crops";

function nftBoosts(crop: Crop, inventory: Inventory) {
  if (
    crop.name === "Cauliflower" &&
    inventory["Golden Cauliflower"]?.greaterThanOrEqualTo(1)
  ) {
    return crop.sellPrice.mul(2);
  }

  return crop.sellPrice;
}

/**
 * How much SFL a crop is worth
 */
export const getSellPrice = (crop: Crop, inventory: Inventory) => {
  let price = nftBoosts(crop, inventory);

  if (inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    price = price.mul(1.1);
  }

  return price;
};
