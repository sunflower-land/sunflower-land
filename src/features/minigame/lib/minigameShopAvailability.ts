import type { MinigameShopItemUi } from "./minigameDashboardTypes";
import { canAffordShopItem } from "./canAffordShopItem";

export function isShopItemPurchaseLimitedOut(
  item: MinigameShopItemUi,
): boolean {
  const cap = item.purchaseLimit;
  if (cap === undefined || cap <= 0) return false;
  return (item.purchasesSoFar ?? 0) >= cap;
}

/** Row is locked (checkmark) only when the rule has a purchase limit and it is exhausted. */
export function isShopItemBoughtOrDisabled(item: MinigameShopItemUi): boolean {
  return isShopItemPurchaseLimitedOut(item);
}

export function canAttemptShopPurchase(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  return (
    canAffordShopItem(item, balances) && !isShopItemPurchaseLimitedOut(item)
  );
}
