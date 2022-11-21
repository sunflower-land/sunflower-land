import {
  Bumpkin,
  Collectibles,
  Inventory,
  InventoryItemName,
} from "../../types/game";
import { SellableItem } from "features/game/events/landExpansion/sellCrop";
import { isSeed } from "features/game/events/plant";
import { CROPS } from "../../types/crops";
import { CAKES } from "../../types/craftables";
import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

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
  if (
    item.name in cakes &&
    bumpkin.equipped.coat &&
    bumpkin.equipped.coat === "Chef Apron"
  ) {
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
  collectibles: Collectibles;
};
/**
 * To be used as boolean flag
 * Update if more upcoming boosts
 */
export const hasBoost = ({ item, collectibles }: HasBoostArgs) => {
  if (
    isSeed(item) &&
    (isCollectibleBuilt("Nancy", collectibles) ||
      isCollectibleBuilt("Scarecrow", collectibles) ||
      isCollectibleBuilt("Kuebiko", collectibles))
  ) {
    return true;
  }

  if (
    item === "Carrot Seed" &&
    isCollectibleBuilt("Easter Bunny", collectibles)
  ) {
    return true;
  }

  if (
    item === "Parsnip Seed" &&
    isCollectibleBuilt("Mysterious Parsnip", collectibles)
  ) {
    return true;
  }

  if (
    item === "Cauliflower Seed" &&
    isCollectibleBuilt("Golden Cauliflower", collectibles)
  ) {
    return true;
  }

  return false;
};

/**
 * Get reduced cooking time from bumpkin skills.
 * @param seconds time to be decreased
 * @param bumpkin to check for skills
 * @returns reduced cooking
 */
export const getCookingTime = (
  seconds: number,
  bumpkin: Bumpkin | undefined
): number => {
  let reducedSecs = new Decimal(seconds);

  // 20% reduction
  if (bumpkin?.skills["Rush Hour"]) {
    reducedSecs = reducedSecs.mul(0.8);
  }

  return reducedSecs.toNumber();
};

/**
 * Get boosted exp from Bumpkin skills.
 * Decimal mul for precision.
 * @todo add "Curer" skill once "Fermenter Goods" are finalized
 * @param foodExp value to be increased
 * @param bumpkin to check for skills
 * @returns boosted food exp
 */
export const getFoodExpBoost = (
  foodExp: number,
  bumpkin: Bumpkin | undefined
): number => {
  let boostedExp = new Decimal(foodExp);

  if (bumpkin?.skills["Kitchen Hand"]) {
    boostedExp = boostedExp.mul(1.1);
  }

  return boostedExp.toNumber();
};
