import React from "react";
import Decimal from "decimal.js-light";

import { ITEM_DETAILS } from "features/game/types/images";
import { Inventory, SalesmanOffer } from "features/game/types/game";
import token from "assets/icons/token_2.png";

import { Button } from "components/ui/Button";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";

interface Props {
  onCraft: () => void;
  inventory: Inventory;
  offer: SalesmanOffer;
}

export const Offer: React.FC<Props> = ({ onCraft, inventory, offer }) => {
  // Ingredient difference
  const lessIngredients = (amount = 1) =>
    getKeys(offer.ingredients).some((name) =>
      offer.ingredients[name]?.mul(amount).greaterThan(inventory[name] || 0)
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

  return (
    <div className="flex">
      <div className="flex flex-col justify-center items-center p-2 relative w-full">
        <p className="text-sm text-center mb-2">My offer:</p>
        {offer.reward.sfl.gt(0) && (
          <div className="flex">
            <img src={token} className="h-6 mr-2" />
            <p className="text-shadow text-center">{`${offer.reward.sfl.toNumber()} SFL`}</p>
          </div>
        )}
        {getKeys(offer.reward.items).map((name) => (
          <div className="flex" key={name}>
            <img src={ITEM_DETAILS[name].image} className="h-6 mr-2" />
            <p className="text-shadow text-center">{`${offer.reward.items[name]} x ${name}`}</p>
          </div>
        ))}

        <div className="border-t border-white w-full mt-2 pt-1 mb-2">
          <p className="text-sm text-center my-2">Your offer</p>

          {getKeys(offer.ingredients).map((ingredientName, index) => {
            const item = ITEM_DETAILS[ingredientName];
            const inventoryAmount =
              inventory[ingredientName]?.toDecimalPlaces(1) || 0;
            const requiredAmount = offer.ingredients[ingredientName] ?? 0;

            // Ingredient difference
            const lessIngredient = new Decimal(inventoryAmount).lessThan(
              requiredAmount
            );

            // rendering item remnants
            const renderRemnants = () => {
              if (lessIngredient) {
                // if inventory items is less than required items
                return (
                  <Label type="danger">{`${inventoryAmount}/${requiredAmount}`}</Label>
                );
              }
              // if inventory items is equal to required items
              return (
                <span className="text-xs text-center">
                  {`${requiredAmount}`}
                </span>
              );
            };

            return (
              <div
                className={`flex items-center space-x-1 ${"w-full"} shrink-0 sm:justify-center my-[1px] sm:mb-1 sm:w-full`}
                key={index}
              >
                <div className="w-5">
                  <img src={item.image} className="h-5" />
                </div>
                {renderRemnants()}
              </div>
            );
          })}
        </div>

        {Action()}
      </div>
    </div>
  );
};
