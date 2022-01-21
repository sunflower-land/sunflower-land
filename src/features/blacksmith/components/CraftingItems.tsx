import React, { useContext, useState } from "react";

import token from "assets/icons/token.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { Context, InventoryItemName } from "features/game/GameProvider";

import { Button } from "components/ui/Button";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/lib/items";
import { Craftable } from "features/game/events/craft";

interface Props {
  items: Partial<Record<InventoryItemName, Craftable>>;
}

export const CraftingItems: React.FC<Props> = ({ items }) => {
  const [selected, setSelected] = useState<Craftable>(Object.values(items)[0]);

  const { state, dispatcher, shortcutItem } = useContext(Context);
  const inventory = state.inventory;

  const hasIngredients = selected.ingredients.every(
    (ingredient) => (inventory[ingredient.item] || 0) >= ingredient.amount
  );
  const hasFunds = state.balance >= selected.price;

  const craft = () => {
    dispatcher({
      type: "item.crafted",
      item: selected.name,
    });

    shortcutItem(selected.name);
  };

  const soldOut = selected.amountLeft === 0;

  const Action = () => {
    if (soldOut) {
      return null;
    }

    if (selected.disabled) {
      return <span className="text-xs mt-1 text-shadow">Locked</span>;
    }

    return (
      <Button
        disabled={!hasFunds || !hasIngredients}
        className="text-xs mt-1"
        onClick={craft}
      >
        Craft
      </Button>
    );
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(items).map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={item.image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 relative">
          {soldOut && (
            <span className="bg-blue-600 text-shadow border text-xxs absolute left-0 -top-4 p-1 rounded-md">
              Sold out
            </span>
          )}
          {!!selected.amountLeft && (
            <span className="bg-blue-600 text-shadow border  text-xxs absolute left-0 -top-4 p-1 rounded-md">
              {`${selected.amountLeft} left`}
            </span>
          )}
          {selected.type === "NFT" && (
            <span className="bg-blue-600 text-shadow border text-xxs absolute right-0 -top-4 p-1 rounded-md">
              NFT
            </span>
          )}

          <span className="text-base text-shadow text-center">
            {selected.name}
          </span>
          <img
            src={selected.image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-xs text-shadow text-center mt-2">
            {selected.description}
          </span>
          <div className="border-t border-white w-full mt-2 pt-1">
            {selected.ingredients.map((ingredient, index) => {
              const item = ITEM_DETAILS[ingredient.item];
              const hasFunds =
                (inventory[ingredient.item] || 0) > ingredient.amount;

              return (
                <div className="flex justify-center items-end" key={index}>
                  <img src={item.image} className="h-5 me-2" />
                  <span
                    className={classNames(
                      "text-xs text-shadow text-center mt-2 ",
                      {
                        "text-red-500": !hasFunds,
                      }
                    )}
                  >
                    {ingredient.amount}
                  </span>
                </div>
              );
            })}

            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ", {
                  "text-red-500": !hasFunds,
                })}
              >
                {`$${selected.price}`}
              </span>
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
