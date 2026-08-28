import Decimal from "decimal.js-light";
import type { CollectibleName } from "features/game/types/craftables";
import type { InventoryItemName } from "features/game/types/game";
import { getKeys } from "lib/object";
import { PET_SHOP_ITEMS } from "features/game/types/petShop";
import {
  EXPIRY_COOLDOWNS,
  type TemporaryCollectibleName,
} from "./collectibleBuilt";
import { isInventoryRenewableCollectible } from "./renewableCollectibles";

/**
 * Temporary collectibles that CANNOT be extended. The two totems boost every
 * activity at once and are getting their own extension rules, so they are
 * deliberately excluded until that design lands.
 */
export const NON_EXTENDABLE_COLLECTIBLES = [
  "Super Totem",
  "Time Warp Totem",
] as const;

export type ExtendableCollectibleName = Exclude<
  TemporaryCollectibleName,
  (typeof NON_EXTENDABLE_COLLECTIBLES)[number]
>;

/** Every temporary collectible a player is allowed to top up. */
export const EXTENDABLE_COLLECTIBLES = getKeys(EXPIRY_COOLDOWNS).filter(
  (name): name is ExtendableCollectibleName =>
    !NON_EXTENDABLE_COLLECTIBLES.includes(
      name as (typeof NON_EXTENDABLE_COLLECTIBLES)[number],
    ),
);

export const isExtendableCollectible = (
  name: CollectibleName,
): name is ExtendableCollectibleName =>
  EXTENDABLE_COLLECTIBLES.includes(name as ExtendableCollectibleName);

export type ExtensionCost = {
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
};

/**
 * What one extension of a temporary collectible costs — deliberately identical to
 * what RENEWING the same item costs, so extending early is never a discount or a
 * premium, just a way to top up before the boost runs out.
 *
 * Hourglasses are the only extendable collectibles that can exist as spare copies
 * in the chest, so they cost one spare copy (matching `collectible.renewed`).
 * Every shrine is `inventoryLimit: 1`, so it costs its pet-shop craft ingredients
 * instead (matching `petShrine.renewed`).
 */
export const getExtensionCost = (
  name: ExtendableCollectibleName,
): ExtensionCost => {
  if (isInventoryRenewableCollectible(name)) {
    return { coins: 0, ingredients: { [name]: new Decimal(1) } };
  }

  const { coins = 0, ingredients } = PET_SHOP_ITEMS[name];

  return { coins, ingredients };
};
