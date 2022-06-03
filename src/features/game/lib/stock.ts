import { InventoryItemName, StockExpiry } from "../types/game";

type IsExpiredArgs = {
  name: InventoryItemName;
  stockExpiry: StockExpiry;
};

export function isExpired({ name, stockExpiry }: IsExpiredArgs) {
  if (!stockExpiry[name]) {
    return false;
  }

  return Date.now() > new Date(stockExpiry[name] as string).getTime();
}
