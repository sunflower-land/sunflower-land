import React from "react";
import { Box } from "components/ui/Box";
import { RecipeIngredient } from "features/game/lib/crafting";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_IDS } from "features/game/types/bumpkin";

interface Props {
  selectedItems: (RecipeIngredient | null)[];
  onBoxSelect: (index: number) => void;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    ingredient: RecipeIngredient,
    sourceIndex?: number,
  ) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => void;
  canEditGrid: boolean;
  isPending: boolean;
  disabled: boolean;
}

export const IngredientGrid: React.FC<Props> = ({
  selectedItems,
  onBoxSelect,
  onDragStart,
  onDragOver,
  onDrop,
  canEditGrid,
  isPending,
  disabled,
}) => (
  <div className="grid grid-cols-3 gap-1 flex-shrink-0">
    {selectedItems.map((item, index) => (
      <div
        className="flex"
        key={`${index}-${item?.collectible ?? item?.wearable ?? "empty"}`}
        draggable={canEditGrid && !isPending && !!item}
        onDragStart={(e) => onDragStart(e, item as RecipeIngredient, index)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
      >
        <Box
          image={
            item?.collectible
              ? ITEM_DETAILS[item.collectible]?.image
              : item?.wearable
                ? getImageUrl(ITEM_IDS[item.wearable])
                : undefined
          }
          onClick={() => onBoxSelect(index)}
          disabled={disabled}
        />
      </div>
    ))}
  </div>
);
