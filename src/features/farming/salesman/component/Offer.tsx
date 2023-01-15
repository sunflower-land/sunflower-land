import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, TradeOffer } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { RequirementLabel } from "components/ui/RequirementLabel";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  getUnplacedAmount,
  hasIngredient,
} from "features/island/hud/components/inventory/utils/inventory";

interface Props {
  onCraft: () => void;
  gameState: GameState;
  offer: TradeOffer;
}

export const Offer: React.FC<Props> = ({ onCraft, gameState, offer }) => {
  // Ingredient difference
  const lessIngredients = () =>
    offer.ingredients?.some(
      (ingredient) =>
        !hasIngredient(gameState, ingredient.name, ingredient.amount)
    );

  const Action = () => {
    return (
      <>
        <Button disabled={lessIngredients()} onClick={onCraft}>
          Trade
        </Button>
      </>
    );
  };

  const details = ITEM_DETAILS[offer.name];
  return (
    <div>
      <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
        <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
          <SquareIcon icon={details.image} width={14} />
          <span className="sm:text-center mb-1">{`${offer.amount} x ${offer.name}`}</span>
        </div>
        <span className="text-xs sm:text-center mb-1">
          {details.description}
        </span>

        <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
          {offer.ingredients?.map((ingredient, index) => (
            <RequirementLabel
              key={index}
              type="item"
              item={ingredient.name}
              balance={getUnplacedAmount(gameState, ingredient.name)}
              requirement={ingredient.amount}
            />
          ))}
        </div>
      </div>
      {Action()}
    </div>
  );
};
