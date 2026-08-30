import Decimal from "decimal.js-light";
import type { InventoryItemName } from "features/game/types/game";
import type { GameState } from "features/game/types/game";
import { PET_SHOP_ITEMS } from "features/game/types/petShop";
import {
  getExpiryCooldown,
  getPlacementGroup,
  isTotem,
  type TemporaryCollectibleName,
} from "./collectibleBuilt";
import { isInventoryRenewableCollectible } from "./renewableCollectibles";

/**
 * Which items may be spent to extend this collectible.
 *
 * A totem accepts EITHER totem, because the two grant the same buff — paying
 * with the other one is simply buying its duration instead. Hourglasses accept
 * only a spare of themselves. Shrines accept neither: they are `inventoryLimit:
 * 1`, so no spare can exist and they pay ingredients instead (see
 * `getExtensionCost`).
 */
export const getExtensionPayments = (
  name: TemporaryCollectibleName,
): TemporaryCollectibleName[] => {
  if (isTotem(name)) return getPlacementGroup(name);

  return isInventoryRenewableCollectible(name) ? [name] : [];
};

export type ExtensionCost = {
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
};

/**
 * What one extension costs — deliberately identical to what RENEWING costs, so
 * extending early is never a discount or a premium, just a way to top up before
 * the boost runs out.
 *
 * Hourglasses and totems can exist as spare copies in the chest, so they cost
 * one spare of whichever item is being spent (matching `collectible.renewed`).
 * Every shrine is `inventoryLimit: 1`, so it costs its pet-shop craft
 * ingredients instead (matching `petShrine.renewed`).
 */
export const getExtensionCost = (
  name: TemporaryCollectibleName,
  payWith: TemporaryCollectibleName = name,
): ExtensionCost => {
  // Keyed on the TARGET, so the shrine branch below stays narrowed; `payWith`
  // is what is actually spent, and the reducer validates the pair.
  if (isInventoryRenewableCollectible(name)) {
    return { coins: 0, ingredients: { [payWith]: new Decimal(1) } };
  }

  const { coins = 0, ingredients } = PET_SHOP_ITEMS[name];

  return { coins, ingredients };
};

/**
 * The name the placement ends up as once it has been extended. Only a totem can
 * change: paying with the OTHER totem leaves the longer-lasting of the two on
 * the map, so a Super Totem spent on a Time Warp Totem promotes it, while a Time
 * Warp Totem spent on a Super Totem just adds its four hours.
 *
 * Decided by comparing durations rather than hardcoding "Super Totem wins", so
 * it stays correct if the two are ever retuned.
 */
export const getExtensionResult = (
  name: TemporaryCollectibleName,
  payWith: TemporaryCollectibleName,
  game: GameState,
): TemporaryCollectibleName =>
  isTotem(name) &&
  isTotem(payWith) &&
  getExpiryCooldown(payWith, game) > getExpiryCooldown(name, game)
    ? payWith
    : name;
