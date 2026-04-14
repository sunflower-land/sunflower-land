import React from "react";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { RecipeIngredient } from "features/game/lib/crafting";
import { RECIPES } from "features/game/lib/crafting";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { validCraftingResourcesSorted } from "./craftingTabConstants";

interface Props {
  remainingInventory: Partial<Record<InventoryItemName, Decimal>>;
  selectedIngredient: RecipeIngredient | null;
  onIngredientSelect: (ingredient: RecipeIngredient) => void;
  onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    ingredient: RecipeIngredient,
    sourceIndex?: number,
  ) => void;
  canEditGrid: boolean;
  isPending: boolean;
  disabled: boolean;
  discoveredRecipes: Partial<Record<string, unknown>>;
}

export const ResourceInventory: React.FC<Props> = ({
  remainingInventory,
  selectedIngredient,
  onIngredientSelect,
  onDragStart,
  canEditGrid,
  isPending,
  disabled,
  discoveredRecipes,
}) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex space-x-3 mb-1 ml-1 mr-2">
        {selectedIngredient && (
          <Label
            type="formula"
            className="ml-1"
            icon={
              selectedIngredient.collectible
                ? ITEM_DETAILS[selectedIngredient.collectible].image
                : undefined
            }
          >
            {selectedIngredient.collectible ?? selectedIngredient.wearable}
          </Label>
        )}
      </div>
      <div className="flex flex-col max-h-72 overflow-y-auto scrollable pr-1">
        <div className="flex flex-wrap">
          {validCraftingResourcesSorted()
            .filter(
              (itemName) =>
                !(itemName in RECIPES) ||
                (itemName in RECIPES && itemName in discoveredRecipes),
            )
            .map((itemName) => {
              const amount = remainingInventory[itemName] || new Decimal(0);
              return (
                <div
                  key={itemName}
                  draggable={canEditGrid && !isPending && amount.greaterThan(0)}
                  onDragStart={(e) => onDragStart(e, { collectible: itemName })}
                  className="flex"
                >
                  <Box
                    count={amount}
                    image={ITEM_DETAILS[itemName]?.image}
                    isSelected={selectedIngredient?.collectible === itemName}
                    onClick={() =>
                      onIngredientSelect({ collectible: itemName })
                    }
                    disabled={disabled}
                  />
                </div>
              );
            })}
          <Box image={SUNNYSIDE.icons.expression_confused} />
        </div>
        <div className="flex items-center mt-1 mx-1">
          <img src={SUNNYSIDE.icons.expression_confused} className="h-4 mr-1" />
          <p className="text-xs">{t("crafting.undiscovered")}</p>
        </div>
      </div>
    </>
  );
};
