import React from "react";
import { CraftingQueueItem } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";

interface CraftingQueueSlotProps {
  item?: CraftingQueueItem;
  readyProducts: CraftingQueueItem[];
  slotIndex?: number;
  isSelected?: boolean;
  onSelect?: (
    slotIndex: number,
    isEmpty: boolean,
    item?: CraftingQueueItem,
  ) => void;
}

export const CraftingQueueSlot: React.FC<CraftingQueueSlotProps> = ({
  item,
  readyProducts,
  slotIndex = 0,
  isSelected = false,
  onSelect,
}) => {
  if (!item) {
    return (
      <Box
        onClick={onSelect ? () => onSelect(slotIndex, true) : undefined}
        isSelected={isSelected}
        className={onSelect ? "cursor-pointer" : undefined}
      />
    );
  }

  const isReady = readyProducts.some(
    (product) =>
      product.name === item.name &&
      product.readyAt === item.readyAt &&
      product.type === item.type,
  );

  const image =
    item.type === "collectible"
      ? ITEM_DETAILS[item.name as InventoryItemName]?.image
      : getImageUrl(ITEM_IDS[item.name as BumpkinItem]);

  const handleClick =
    !isReady && onSelect ? () => onSelect(slotIndex, false, item) : undefined;

  return (
    <>
      <div className="relative">
        {isReady && (
          <img
            className="absolute top-1 right-1 w-4 z-10"
            src={SUNNYSIDE.icons.confirm}
          />
        )}
      </div>
      <Box
        image={image}
        isSelected={isSelected}
        onClick={handleClick}
        className={!isReady && onSelect ? "cursor-pointer" : undefined}
      />
    </>
  );
};
