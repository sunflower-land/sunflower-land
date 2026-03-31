import Decimal from "decimal.js-light";
import type { MinigameShopItemUi } from "./minigameDashboardTypes";

export function canAffordShopItem(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  return new Decimal(balances[item.price.token] ?? 0).gte(item.price.amount);
}
