import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import {
  Inventory,
  WarCollectionOffer as Offer,
} from "features/game/types/game";

import warBond from "src/assets/icons/warBond.png";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";

interface Props {
  onCraft: () => void;
  inventory: Inventory;
  offer: Offer;
}

export const WarCollectionOffer: React.FC<Props> = ({
  onCraft,
  inventory,
  offer,
}) => {
  const lessIngredients = () =>
    offer.ingredients?.some(
      (ingredient) => ingredient.amount > (inventory[ingredient.name] || 0)
    );

  const renderRemenants = () => {
    if (lessIngredients()) {
      // if inventory items is less than required items
      return (
        <>
          <span className="text-xs text-shadow text-center mt-2 text-red-500">
            {`${inventoryAmount}`}
          </span>
          <span className="text-xs text-shadow text-center mt-2 text-red-500">
            {`/${requiredAmount}`}
          </span>
        </>
      );
    } else {
      // if inventory items is equal to required items
      return (
        <span className="text-xs text-shadow text-center mt-2">
          {`${requiredAmount}`}
        </span>
      );
    }
  };

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

  return (
    <div className="flex">
      <div className="flex flex-col justify-center items-center p-2 relative w-full">
        <span className="text-shadow text-center">{`${offer.warBonds} x war bonds`}</span>
        <img src={warBond} className="h-16 img-highlight mt-1" alt="War bond" />
        <span className="text-shadow text-center mt-2 text-xs">
          Exchange for rare items
        </span>

        <div className="border-t border-white w-full mt-2 pt-1 mb-2">
          {offer.ingredients?.map((ingredient, index) => {
            const item = ITEM_DETAILS[ingredient.name];
            const inventoryAmount = inventory[ingredient.name] || 0;
            const lessIngredient = new Decimal(inventoryAmount).lessThan(
              ingredient.amount
            );

            return (
              <div className="flex justify-center items-end" key={index}>
                <img src={item.image} className="h-5 me-2" />
                {lessIngredient && (
                  <>
                    <span className="text-xs text-shadow text-center mt-2 text-red-500">
                      {`${inventoryAmount}`}
                    </span>
                    <span className="text-xs text-shadow text-center mt-2 text-red-500">
                      {`/${ingredient.amount}`}
                    </span>
                  </>
                )}

                {!lessIngredient && (
                  <span className={"text-xs text-shadow text-center mt-2 "}>
                    {ingredient.amount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {Action()}
      </div>
    </div>
  );
};
