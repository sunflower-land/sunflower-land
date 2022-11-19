import React from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import token from "assets/icons/token_2.png";

import { Ingredient } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { RedLabel } from "components/ui/RedLabel";

export interface Props {
  gameState: GameState;
  resources: Ingredient[];
  sfl: Decimal;
}

export const Ingredients: React.FC<Props> = ({ gameState, resources, sfl }) => {
  return (
    <div>
      {resources?.map((ingredient, index) => {
        const item = ITEM_DETAILS[ingredient.item];
        const inventoryAmount =
          gameState.inventory[ingredient.item]?.toDecimalPlaces() || 0;
        const requiredAmount = ingredient.amount.toDecimalPlaces();

        const isMissingIngredient = new Decimal(inventoryAmount).lessThan(
          requiredAmount
        );

        return (
          <div className="flex items-center mb-1" key={index}>
            <img src={item.image} className="h-6 mr-2" />
            {isMissingIngredient ? (
              <RedLabel>{`${inventoryAmount}/${requiredAmount}`}</RedLabel>
            ) : (
              <span className={classNames("text-sm text-shadow text-center ")}>
                {requiredAmount}
              </span>
            )}
          </div>
        );
      })}

      {sfl && sfl.gt(0) && (
        <div className="flex  items-center">
          <img src={token} className="h-6 mr-2" />
          {gameState.balance.lessThan(sfl) ? (
            <RedLabel>{`${sfl.toNumber()} SFL`}</RedLabel>
          ) : (
            <span
              className={classNames("text-sm text-shadow text-center ", {})}
            >
              {`${sfl.toNumber()} SFL`}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
