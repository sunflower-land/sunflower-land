import { CROPS } from "../types/crops";
import { InventoryItemName } from "../types/game";
import { RESOURCES } from "../types/resources";

/**
 * Tools and resources have 18 decimal places
 * Other items (NFTs) and collectibles have 1
 */
export function getItemUnit(name: InventoryItemName) {
  if (name in CROPS() || name in RESOURCES) {
    return "ether";
  }

  return "wei";
}
