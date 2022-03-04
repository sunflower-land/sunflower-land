import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Craftable, LimitedItems } from "features/game/types/craftables";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { metamask } from "lib/blockchain/metamask";
import { ItemSupply } from "lib/blockchain/Inventory";
import { canWithdraw } from "features/game/lib/whitelist";

interface Props {
  onClose: () => void;
}

export const Rare: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<Craftable>(
    Object.values(LimitedItems)[0]
  );
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState<ItemSupply>();

  useEffect(() => {
    const load = async () => {
      const supply = await metamask.getInventory().totalSupply();
      setSupply(supply);
      setIsLoading(false);
    };

    load();
  }, []);
  const inventory = state.inventory;

  const lessIngredients = (amount = 1) =>
    selected.ingredients.some((ingredient) =>
      ingredient.amount.mul(amount).greaterThan(inventory[ingredient.item] || 0)
    );
  const lessFunds = (amount = 1) =>
    state.balance.lessThan(selected.price.mul(amount));

  const craft = () => {
    console.log("Craft it!");
    gameService.send("MINT", { item: selected.name });
    onClose();
    // TODO fire off API mint call
    // setToast({ content: "SFL -$" + selected.price });
    // selected.ingredients.map((ingredient) => {
    //   setToast({
    //     content: "Item " + ingredient.item + " -" + ingredient.amount,
    //   });
    // });
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  let amountLeft = 0;
  if (supply && selected.supply) {
    amountLeft = selected.supply - supply[selected.name]?.toNumber();
  }

  const soldOut = amountLeft <= 0;

  const Action = () => {
    if (soldOut) {
      return null;
    }

    if (!canWithdraw(metamask.myAccount as string)) {
      return "Locked";
    }

    return (
      <>
        <Button
          disabled={lessFunds() || lessIngredients()}
          className="text-xs mt-1"
          onClick={() => craft()}
        >
          Craft
        </Button>
      </>
    );
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(LimitedItems).map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={ITEM_DETAILS[item.name].image}
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
          {!!selected.supply && amountLeft > 0 && (
            <span className="bg-blue-600 text-shadow border  text-xxs absolute left-0 -top-4 p-1 rounded-md">
              {`${amountLeft} left`}
            </span>
          )}

          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {selected.description}
          </span>
          <div className="border-t border-white w-full mt-2 pt-1">
            {selected.ingredients.map((ingredient, index) => {
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

            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`$${selected.price.toNumber()}`}
              </span>
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
