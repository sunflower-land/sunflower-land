import { InventoryItemName, StockExpiry } from "../types/game";

type IsExpiredArgs = {
  name: InventoryItemName;
  stockExpiry: StockExpiry;
  now?: Date;
};

export function isExpired({ name, stockExpiry }: IsExpiredArgs) {
  if (!stockExpiry[name]) {
    return false;
  }

  console.log({
    name,
    now: Date.now(),
    time: new Date(stockExpiry[name] as string).getTime(),
  });
  return Date.now() > new Date(stockExpiry[name] as string).getTime();
}
