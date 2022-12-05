import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { secondsToString } from "lib/utils/time";

import { Context } from "features/game/GameProvider";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import { Stock } from "components/ui/Stock";
import { Bean, BeanName, BEANS } from "features/game/types/beans";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

interface Props {
  onClose: () => void;
}

export const ExoticSeeds: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<Bean>(BEANS()["Magic Bean"]);
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;
  const collectibles = state.collectibles;

  const price = selected.sfl;
  const buy = (amount = 1) => {
    gameService.send("bean.bought", {
      bean: selected.name,
    });

    setToast({
      icon: tokenStatic,
      content: `-${selected.sfl?.mul(amount).toString()}`,
    });

    shortcutItem(selected.name);
  };

  const lessFunds = (amount = 1) => {
    if (!price) return false;

    return state.balance.lessThan(price.mul(amount).toString());
  };

  const lessIngredients = () => {
    return getKeys(selected.ingredients).some((ingredientName) => {
      const inventoryAmount =
        inventory[ingredientName]?.toDecimalPlaces(1) || new Decimal(0);
      const requiredAmount =
        selected.ingredients[ingredientName]?.toDecimalPlaces(1) ||
        new Decimal(0);
      return new Decimal(inventoryAmount).lessThan(requiredAmount);
    });
  };

  const getInventoryItemCount = (name: BeanName) => {
    return inventory[name]?.sub(
      collectibles[name as CollectibleName]?.length ?? 0
    );
  };

  const stock = state.stock[selected.name] || new Decimal(0);
  const Action = () => {
    if (stock?.equals(0)) {
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

    const max = INITIAL_STOCK[selected.name];

    if (max && getInventoryItemCount(selected.name)?.gt(max)) {
      return (
        <span className="text-xs mt-1 text-center">
          {`Max ${max} ${selected.name}s`}
        </span>
      );
    }

    if (CONFIG.NETWORK === "mainnet" || selected.name !== "Magic Bean") {
      return <span className="text-sm">Coming soon</span>;
    }

    return (
      <>
        <Button
          disabled={lessFunds() || lessIngredients() || stock?.lessThan(1)}
          className="text-xs mt-1"
          onClick={() => buy(1)}
        >
          Buy 1
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
      >
        {Object.values(BEANS()).map((item: Bean) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={ITEM_DETAILS[item.name].image}
            count={getInventoryItemCount(item.name)}
          />
        ))}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-center p-2 relative">
          <Stock item={selected} />
          <span className="text-center mb-1">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="w-8 sm:w-12 img-highlight mt-1"
            alt={selected.name}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-center scale-75 sm:scale-100">
              <img src={timer} className="h-5 me-2" />
              <span className="text-xs text-center mt-2">
                {secondsToString(selected.plantSeconds, { length: "medium" })}
              </span>
            </div>

            {getKeys(selected.ingredients).map((ingredientName, index) => {
              const item = ITEM_DETAILS[ingredientName];
              const inventoryAmount =
                inventory[ingredientName]?.toDecimalPlaces(1) || 0;
              const requiredAmount =
                selected.ingredients[ingredientName]?.toDecimalPlaces(1) ||
                new Decimal(0);

              // Ingredient difference
              const lessIngredient = new Decimal(inventoryAmount).lessThan(
                requiredAmount
              );

              // rendering item remenants
              const renderRemenants = () => {
                if (lessIngredient) {
                  return (
                    <Label type="danger">{`${inventoryAmount}/${requiredAmount}`}</Label>
                  );
                } else {
                  // if inventory items is equal to required items
                  return (
                    <span className="text-xs text-center mt-2">
                      {`${requiredAmount}`}
                    </span>
                  );
                }
              };

              return (
                <div
                  className="flex justify-center flex-wrap items-end"
                  key={index}
                >
                  <img src={item.image} className="h-5 me-2" />
                  {renderRemenants()}
                </div>
              );
            })}
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              {lessFunds() ? (
                <Label type="danger">{`${price}`}</Label>
              ) : (
                <span className={classNames("text-xs text-center mt-2")}>
                  {`${price}`}
                </span>
              )}
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
