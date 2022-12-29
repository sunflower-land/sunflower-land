import React from "react";
import Decimal from "decimal.js-light";

import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import { Inventory } from "features/game/types/game";
import { shortenCount } from "lib/utils/formatNumber";

interface RemnantProps {
  lessIngredient: boolean;
  inventoryAmount: Decimal | undefined;
  requiredAmount: Decimal;
}

interface Props {
  ingredients: Inventory;
  inventory: Inventory;
  extraIngredientCount?: number;
}

const IngredientRemnants: React.FC<RemnantProps> = ({
  lessIngredient,
  inventoryAmount,
  requiredAmount,
}) => {
  if (lessIngredient) {
    // if inventory items is less than required items
    return (
      <Label type="danger">{`${inventoryAmount}/${requiredAmount}`}</Label>
    );
  }

  return (
    <span className="text-xs text-center">
      {`${shortenCount(inventoryAmount)}/${requiredAmount}`}
    </span>
  );
};

/**
 * Renders ingredient rows that can be used in the modals
 * @param ingredients
 * @param inventory
 * @param extraIngredientCount Optional
 */
export const PanelIngredients: React.FC<Props> = ({
  ingredients,
  inventory,
  extraIngredientCount = 0,
}) => {
  const ingredientKeys = getKeys(ingredients);
  const ingredientCount = ingredientKeys.length + extraIngredientCount;

  return (
    <>
      {ingredientKeys.map((name, index) => {
        const item = ITEM_DETAILS[name];
        const inventoryAmount =
          inventory[name]?.toDecimalPlaces(1) || new Decimal(0);
        const requiredAmount =
          ingredients[name]?.toDecimalPlaces(1) || new Decimal(0);

        // Ingredient difference
        const lessIngredient = new Decimal(inventoryAmount).lessThan(
          requiredAmount
        );

        return (
          <div
            className={`flex items-center space-x-1 ${
              ingredientCount > 2 ? "w-1/2" : "w-full"
            } shrink-0 sm:justify-center my-[1px] sm:w-full sm:mb-1`}
            key={index}
          >
            <div className="w-5">
              <img src={item.image} className="h-5" />
            </div>
            <IngredientRemnants
              lessIngredient={lessIngredient}
              inventoryAmount={inventoryAmount}
              requiredAmount={requiredAmount}
            />
          </div>
        );
      })}
    </>
  );
};
