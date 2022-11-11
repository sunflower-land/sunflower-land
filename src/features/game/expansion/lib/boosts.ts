import { Bumpkin, Inventory, InventoryItemName } from "../../types/game";
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import { isSeed } from "features/game/events/plant";
import { CROPS } from "../../types/crops";
import { CAKES } from "../../types/craftables";
import Decimal from "decimal.js-light";

const crops = CROPS();
const cakes = CAKES();

/**
 * How much SFL an item is worth
 */
export const getSellPrice = (
  item: SellableItem,
  inventory: Inventory,
  bumpkin: Bumpkin
) => {
  let price = item.sellPrice;
  const { skills } = bumpkin;

  if (!price) {
    return new Decimal(0);
  }

  // apply Green Thumb boost to crop LEGACY SKILL!
  if (item.name in crops && inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    price = price.mul(1.05);
  }

  // apply Chef Apron 20% boost when selling cakes
  if (item.name in cakes && bumpkin.equipped.coat === "Chef Apron") {
    price = price.mul(1.2);
  }

  // apply Green Thumb boost to crop BUMPKIN NEW SKILL!
  if (item.name in crops && skills["Green Thumb"]) {
    price = price.mul(1.05);
  }

  return price;
};

/**
 * To be used as boolean flag
 * Update if more upcoming boosts
 */
export const hasSellBoost = (inventory: Inventory, bumpkin: Bumpkin) => {
  const { skills } = bumpkin;
  if (inventory["Green Thumb"]?.greaterThanOrEqualTo(1)) {
    return true;
  }
  if (skills["Green Thumb"]) {
    return true;
  }

  return false;
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
    item === "Cauliflower Seed" &&
    inventory["Golden Cauliflower"]?.greaterThanOrEqualTo(1)
  ) {
    return true;
  }

  return false;
};
