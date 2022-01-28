import { InventoryItemName } from "features/game/types/game";

/**
 * Cache selected items in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "inventory.selectedItems";

export function cacheShortcuts(item: InventoryItemName) {
  const previous = getShortcuts();

  const unique = previous.filter((name) => name !== item);

  const newItems = [item, ...unique.slice(0, 2)];

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));

  return newItems;
}

export function getShortcuts(): InventoryItemName[] {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!cached) {
    return [];
  }

  return JSON.parse(cached);
}
