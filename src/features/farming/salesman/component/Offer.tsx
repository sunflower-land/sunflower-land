import React from "react";
import classNames from "classnames";

import { ITEM_DETAILS } from "features/game/types/images";
import { Inventory, TradeOffer } from "features/game/types/game";

import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";

interface Props {
  onCraft: () => void;
  inventory: Inventory;
  offer: TradeOffer;
}

export const Offer: React.FC<Props> = ({ onCraft, inventory, offer }) => {
  // Ingredient difference
  const lessIngredients = (amount = 1) =>
    offer.ingredients?.some((ingredient) =>
      ingredient.amount.mul(amount).greaterThan(inventory[ingredient.name] || 0)
    );

  const Action = () => {
    return (
      <>
        <Button
          disabled={lessIngredients()}
          className="text-xs mt-1"
          onClick={onCraft}
        >
          Trade
        </Button>
      </>
    );
  };

  const details = ITEM_DETAILS[offer.name];
  return (
    <div className="flex">
      <div className="flex flex-col justify-center items-center p-2 relative w-full">
        <span className="text-shadow text-center">{offer.name}</span>
        <img
          src={details.image}
          className="h-16 img-highlight mt-1"
          alt={offer.name}
        />
        <span className="text-shadow text-center mt-2 sm:text-sm">
          {details.description}
        </span>

        <div className="border-t border-white w-full mt-2 pt-1 mb-2">
          {offer.ingredients?.map((ingredient, index) => {
            const item = ITEM_DETAILS[ingredient.name];
            const lessIngredient = new Decimal(
              inventory[ingredient.name] || 0
            ).lessThan(ingredient.amount);

            return (
              <div className="flex justify-center items-end" key={index}>
                <img src={item.image} className="h-5 me-2" />
                <span
                  className={classNames(
                    "text-xs text-shadow text-center mt-2 ",
                    {
                      "text-red-500": lessIngredient,
                    }
                  )}
                >
                  {ingredient.amount.toNumber()}
                </span>
              </div>
            );
          })}
        </div>

        {Action()}
      </div>
    </div>
  );
};
