import type { MinigameShopItemUi } from "./minigameDashboardTypes";
import { canAffordShopItem } from "./canAffordShopItem";

export function isShopItemOwned(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  const key = item.ownedBalanceToken;
  if (!key) return false;
  return (balances[key] ?? 0) >= 1;
}

export function isShopItemPurchaseLimitedOut(
  item: MinigameShopItemUi,
): boolean {
  const cap = item.purchaseLimit;
  if (cap === undefined || cap <= 0) return false;
  return (item.purchasesSoFar ?? 0) >= cap;
}

/** Row is locked (checkmark): balance-based “owned” or lifetime purchase cap reached. */
export function isShopItemBoughtOrDisabled(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  return isShopItemOwned(item, balances) || isShopItemPurchaseLimitedOut(item);
}

export function canAttemptShopPurchase(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  return (
    canAffordShopItem(item, balances) && !isShopItemPurchaseLimitedOut(item)
  );
}
