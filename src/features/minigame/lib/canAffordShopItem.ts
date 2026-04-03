import Decimal from "decimal.js-light";
import type { MinigameShopItemUi } from "./minigameDashboardTypes";

export function canAffordShopPriceLine(
  balances: Record<string, number>,
  line: { token: string; amount: number },
): boolean {
  return new Decimal(balances[line.token] ?? 0).gte(line.amount);
}

export function canAffordShopItem(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  return item.prices.every((line) => canAffordShopPriceLine(balances, line));
}
