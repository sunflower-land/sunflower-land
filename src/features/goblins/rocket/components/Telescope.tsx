import React, { useContext } from "react";
import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { LimitedItem } from "features/game/types/craftables";

import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";

interface Props {
  onCraft: () => void;
  onClose: () => void;
}

export const Telescope: React.FC<Props> = ({ onCraft, onClose }) => {
  const { goblinService } = useContext(Context);
  const [
    {
      context: { limitedItems, state },
    },
  ] = useActor(goblinService);

  // TODO - Enable this once recipe goes live on blockchain.
  // const telescopeInfo = limitedItems["Telescope"] as LimitedItem;

  // TODO - This is a placeholder recipe. Remove this once recipe becomes live on testnet.
  const telescopeInfo = {
    name: "Telescope",
    description: "Use this to see Melon Dusk again!",
    ingredients: [
      {
        id: 601,
        item: "Wood",
        amount: new Decimal(1),
      },
      {
        id: 201,
        item: "Sunflower",
        amount: new Decimal(1),
      },
    ],
  } as LimitedItem;

  // Ingredient difference
  const lessIngredients = (amount = 1) =>
    telescopeInfo.ingredients?.some((ingredient) =>
      ingredient.amount
        .mul(amount)
        .greaterThan(state.inventory[ingredient.item] || 0)
    );

  return (
    <div className="flex">
      <OuterPanel className="flex-1 flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-3 relative w-full">
          <span className="text-shadow text-center">{telescopeInfo.name}</span>
          <img
            src={ITEM_DETAILS[telescopeInfo.name].image}
            className="h-32 img-highlight mt-1"
            alt={telescopeInfo.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {telescopeInfo.description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1 mb-2">
            {telescopeInfo.ingredients?.map((ingredient) => {
              const item = ITEM_DETAILS[ingredient.item];
              const lessIngredient = new Decimal(
                state.inventory[ingredient.item] || 0
              ).lessThan(ingredient.amount);

              return (
                <div
                  className="flex justify-center items-end"
                  key={ingredient.item}
                >
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

          <Button
            className="text-xs mt-1"
            onClick={onCraft}
            disabled={lessIngredients()}
          >
            Mint
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
