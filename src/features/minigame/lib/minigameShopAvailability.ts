import Decimal from "decimal.js-light";
import type { MinigameShopItemUi } from "./minigameDashboardTypes";
import { canAffordShopItem } from "./canAffordShopItem";

export function isShopItemMaxCallsReached(item: MinigameShopItemUi): boolean {
  const cap = item.maxCalls;
  if (cap === undefined || cap <= 0) return false;
  return (item.callsSoFar ?? 0) >= cap;
}

/**
 * Row is “purchased” (checkmark, non-clickable) when per-farm max calls are exhausted.
 * Global supply exhaustion still allows opening the detail view so the sold-out message is visible.
 */
export function isShopItemBoughtOrDisabled(item: MinigameShopItemUi): boolean {
  return isShopItemMaxCallsReached(item);
}

export function canAttemptShopPurchase(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  return (
    canAffordShopItem(item, balances) &&
    !isShopItemMaxCallsReached(item) &&
    item.supplyBlocked !== true
  );
}

export function canAttemptFlowerPurchase(
  flowerCost: number,
  farmBalance: Decimal,
): boolean {
  const c = Math.floor(Number(flowerCost));
  if (!Number.isFinite(c) || c < 1) return false;
  return farmBalance.gte(c);
}
