import { useEffect, useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import { hasBoost } from "features/game/expansion/lib/boosts";

interface Args {
  selectedItem?: InventoryItemName;
  collectibles: GameState["collectibles"];
}

/**
 * Used in inventory to show if the selected item has a boost or not
 * @param param0 inventory item selected
 * @param param0 inventory for player
 * @returns bool
 */

export const useHasBoostForItem = ({ selectedItem, collectibles }: Args) => {
  const [isTimeBoosted, setIsTimeBoosted] = useState(false);

  useEffect(() => {
    if (!selectedItem) return;

    setIsTimeBoosted(
      hasBoost({
        item: selectedItem as InventoryItemName,
        collectibles,
      })
    );
  }, [selectedItem, collectibles]);

  return isTimeBoosted;
};
