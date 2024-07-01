import { InventoryItemName } from "features/game/types/game";

export function makeListingType(
  items: Partial<Record<InventoryItemName, number>>,
): string {
  // Function to convert items to camelCase if they have multiple words
  function formatItemName(itemName: string): string {
    return itemName
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join("");
  }

  return Object.keys(items)
    .map(formatItemName) // Apply formatting to each item name
    .sort()
    .join("-");
}
