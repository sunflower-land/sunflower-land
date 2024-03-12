import { InventoryItemName } from "features/game/types/game";

export function makeListingType(
  items: Partial<Record<InventoryItemName, number>>
): string {
  return Object.keys(items).sort().join("-").toLowerCase();
}
