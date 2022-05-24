import { useEffect, useState } from "react";
import { hasBoost } from "features/game/lib/boosts";
import { InventoryItemName } from "features/game/types/game";
import { Inventory } from "../InventoryItems";

interface Args {
  selectedItem?: InventoryItemName;
  inventory: Inventory;
}

/**
 * Used in inventory to show if the selected item has a boost or not
 * @param param0 inventory item selected
 * @param param0 inventory for player
 * @returns bool
 */

export const useHasBoostForItem = ({ selectedItem, inventory }: Args) => {
  const [isTimeBoosted, setIsTimeBoosted] = useState(false);

  useEffect(() => {
    if (!selectedItem) return;

    setIsTimeBoosted(
      hasBoost({
        item: selectedItem as InventoryItemName,
        inventory,
      })
    );
  }, [selectedItem, inventory]);

  return isTimeBoosted;
};
