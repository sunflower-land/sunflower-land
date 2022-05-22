import React, { useContext } from "react";
import classNames from "classnames";

import { ITEM_DETAILS } from "features/game/types/images";
import { LimitedItem } from "features/game/types/craftables";
import { Inventory } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";

import { KNOWN_IDS } from "features/game/types";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";

interface Props {
  onCraft: () => void;
  inventory: Inventory;
}

export const EngineCore: React.FC<Props> = ({ onCraft, inventory }) => {
  const { goblinService } = useContext(Context);
  const [
    {
      context: { limitedItems },
    },
  ] = useActor(goblinService);
  const selected = limitedItems["Engine Core"] as LimitedItem;

  // Ingredient difference
  const lessIngredients = (amount = 1) =>
    selected.ingredients?.some((ingredient) =>
      ingredient.amount.mul(amount).greaterThan(inventory[ingredient.item] || 0)
    );

  const Action = () => {
    return (
      <>
        <Button
          disabled={lessIngredients()}
          className="text-xs mt-1"
          onClick={onCraft}
        >
          Craft
        </Button>
      </>
    );
  };

  return (
    <div className="flex">
      <OuterPanel className="flex-1 flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {selected.description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1 mb-2">
            {selected.ingredients?.map((ingredient, index) => {
              const item = ITEM_DETAILS[ingredient.item];
              const lessIngredient = new Decimal(
                inventory[ingredient.item] || 0
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
        <a
          href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${
            KNOWN_IDS[selected.name]
          }`}
          className="underline text-xs hover:text-blue-500 my-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Sea
        </a>
      </OuterPanel>
    </div>
  );
};
