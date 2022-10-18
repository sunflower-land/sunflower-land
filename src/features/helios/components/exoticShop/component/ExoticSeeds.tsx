import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { secondsToMidString } from "lib/utils/time";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import { Stock } from "components/ui/Stock";
import { ExoticSeed, EXOTIC_SEEDS } from "features/game/types/seeds";

interface Props {
  onClose: () => void;
}

export const ExoticSeeds: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<ExoticSeed>(
    EXOTIC_SEEDS()["Magic Bean"]
  );
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const price = selected.sfl;
  const buy = (amount = 1) => {
    gameService.send("seed.bought", {
      item: selected.name,
      amount,
    });

    setToast({
      icon: tokenStatic,
      content: `-$${selected.sfl?.mul(amount).toString()}`,
    });

    shortcutItem(selected.name);
  };

  const lessFunds = (amount = 1) => {
    if (!price) return false;

    return state.balance.lessThan(price.mul(amount).toString());
  };

  const stock = state.stock[selected.name] || new Decimal(0);
  const Action = () => {
    return <span className="text-center text-xs mt-2">Coming soon</span>;
    // if (stock?.equals(0)) {
    //   return (
    //     <div>
    //       <p className="text-xxs no-wrap text-center my-1 underline">
    //         Sold out
    //       </p>
    //       <p className="text-xxs text-center">
    //         Sync your farm to the Blockchain to restock
    //       </p>
    //     </div>
    //   );
    // }

    // const max = INITIAL_STOCK[selected.name];

    // if (max && inventory[selected.name]?.gt(max)) {
    //   return (
    //     <span className="text-xs mt-1 text-shadow text-center">
    //       {`Max ${max} ${selected.name}s`}
    //     </span>
    //   );
    // }

    // const disabled = true;
    // if (disabled) {
    //   return <span className="text-sm">Coming soon</span>;
    // }

    // return (
    //   <>
    //     <Button
    //       disabled={lessFunds() || stock?.lessThan(1)}
    //       className="text-xs mt-1"
    //       onClick={() => buy(1)}
    //     >
    //       Buy 1
    //     </Button>
    //   </>
    // );
  };

  return (
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {Object.values(EXOTIC_SEEDS()).map((item: ExoticSeed) => (
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
          <Stock item={selected} />
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="w-8 sm:w-12 img-highlight mt-1"
            alt={selected.name}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-center scale-75 sm:scale-100">
              <img src={timer} className="h-5 me-2" />
              <span className="text-xs text-shadow text-center mt-2">
                {secondsToMidString(selected.plantSeconds)}
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
              <span
                className={classNames("text-xs text-shadow text-center mt-2", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`$${price}`}
              </span>
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
