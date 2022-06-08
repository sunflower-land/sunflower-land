import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";
import tokenStatic from "assets/icons/token.png";
import stopwatch from "assets/icons/stopwatch.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { CAKES, CraftableItem } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { isExpired } from "features/game/lib/stock";
import { CONFIG } from "lib/config";

interface Props {
  items: Partial<Record<InventoryItemName, CraftableItem>>;
}

export const CraftingItems: React.FC<Props> = ({ items }) => {
  const [selected, setSelected] = useState<CraftableItem>(
    Object.values(items)[0]
  );
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const lessIngredients = (amount = 1) =>
    selected.ingredients?.some((ingredient) =>
      ingredient.amount.mul(amount).greaterThan(inventory[ingredient.item] || 0)
    );
  const lessFunds = (amount = 1) =>
    state.balance.lessThan(selected.tokenAmount?.mul(amount) || 0);

  const hasSelectedFood =
    Object.keys(inventory).includes(selected.name) &&
    inventory[selected.name]?.gt(0);

  const canCraft = !(lessFunds() || lessIngredients());

  const craft = () => {
    gameService.send("item.crafted", {
      item: selected.name,
      amount: 1,
    });

    setToast({
      icon: tokenStatic,
      content: `-$${selected.tokenAmount?.mul(1)}`,
    });

    selected.ingredients?.map((ingredient) => {
      const item = ITEM_DETAILS[ingredient.item];
      setToast({
        icon: item.image,
        content: `-${ingredient.amount}`,
      });
    });

    shortcutItem(selected.name);
  };

  const validItems = Object.values(items).filter(
    (item) =>
      !isExpired({ name: item.name, stockExpiry: state.stockExpiry }) &&
      // Only show cakes on testnet
      (CONFIG.NETWORK === "mumbai" || !(item.name in CAKES()))
  );

  const expiryTime = state.stockExpiry[selected.name];

  const ItemContent = () => {
    if (!state.stock[selected.name] || state.stock[selected.name]?.eq(0)) {
      return (
        <div>
          <p className="text-xxs no-wrap text-center my-1 underline">
            Sold out
          </p>
          <p className="text-xxs text-center">
            Sync your farm to the Blockchain to restock
          </p>
        </div>
      );
    }

    if (hasSelectedFood) {
      return <span className="text-xs text-center mt-4">Already crafted</span>;
    }

    return (
      <>
        <div className="border-t border-white w-full mt-2 pt-1">
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

          <div className="flex justify-center items-end">
            <img src={token} className="h-5 mr-1" />
            <span
              className={classNames("text-xs text-shadow text-center mt-2 ", {
                "text-red-500": lessFunds(),
              })}
            >
              {`$${selected.tokenAmount?.toNumber()}`}
            </span>
          </div>
        </div>
        <Button
          disabled={hasSelectedFood || !canCraft}
          className={`${hasSelectedFood ? "pe-none" : ""} text-xs mt-1`}
          onClick={craft}
        >
          {hasSelectedFood ? "Already crafted" : "Craft"}
        </Button>
      </>
    );
  };

  const secondsLeft =
    expiryTime && (new Date(expiryTime).getTime() - Date.now()) / 1000;

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {validItems.map((item) => (
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
          {expiryTime && (
            <span className="bg-blue-600 border flex text-[8px] sm:text-xxs items-center absolute -top-4 p-[3px] rounded-md whitespace-nowrap">
              <img src={stopwatch} className="w-3 left-0 -top-4 mr-1" />
              <span className="mt-[2px]">{`${secondsToString(
                secondsLeft as number,
                {
                  separator: " ",
                }
              )} left`}</span>
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

          {ItemContent()}
        </div>
      </OuterPanel>
    </div>
  );
};
