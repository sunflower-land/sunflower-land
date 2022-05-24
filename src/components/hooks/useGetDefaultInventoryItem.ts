import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { InventoryItemName } from "features/game/types/game";
import { useEffect } from "react";

interface Args {
  setDefaultSelectedItem: (item: InventoryItemName) => void;
  inventoryMap: Record<string, InventoryItemName[]>;
  inventoryCategories: InventoryItemName[];
  isFarming?: boolean;
}

/**
 * Get the default selected item of the inventory modal
 * @param setDefaultSelectedItem setter for selected item
 * @param inventoryMap mapping of the inventory items
 * @param inventoryCategories
 * @param isFarming is the inventory used inside of the farming state machine context
 */

export const useMakeDefaultInventoryItem = ({
  setDefaultSelectedItem,
  inventoryMap,
  inventoryCategories,
  isFarming,
}: Args) => {
  useEffect(() => {
    const firstCategoryWithItem = inventoryCategories.find(
      (category) => !!inventoryMap[category]?.length
    );

    const currentSelected = isFarming && getShortcuts()[0];

    const defaultSelectedItem =
      currentSelected ||
      // Fallback for when a no active item selected
      (firstCategoryWithItem && inventoryMap[firstCategoryWithItem][0]);

    if (defaultSelectedItem) {
      setDefaultSelectedItem(defaultSelectedItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
