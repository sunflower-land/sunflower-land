import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

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
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { secondsToString } from "lib/utils/time";
import { Delayed } from "features/island/buildings/components/building/market/Delayed";
import { SUNNYSIDE } from "assets/sunnyside";

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
  const [showCaptcha, setShowCaptcha] = useState(false);
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

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });

    onClose();
  };

  if (showCaptcha) {
    return (
      <CloudFlareCaptcha
        action="exotic-seeds-sync"
        onDone={onCaptchaSolved}
        onExpire={() => setShowCaptcha(false)}
        onError={() => setShowCaptcha(false)}
      />
    );
  }

  const restock = () => {
    // setShowCaptcha(true);
    gameService.send("SYNC", { captcha: "" });

    onClose();
  };

  const stock = state.stock[selected.name] || new Decimal(0);
  const max = INITIAL_STOCK[selected.name];
  const inventoryCount = getInventoryItemCount(selected.name) ?? new Decimal(0);
  const inventoryFull = max ? inventoryCount.gt(max) : true;

  const labelState = () => {
    const max = INITIAL_STOCK[selected.name];
    const inventoryCount = inventory[selected.name] ?? new Decimal(0);
    const inventoryFull = max ? inventoryCount.gt(max) : true;

    if (stock?.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }

    return (
      <Stock item={{ name: selected.name }} inventoryFull={inventoryFull} />
    );
  };

  const Action = () => {
    if (stock?.equals(0)) {
      return <Delayed restock={restock}></Delayed>;
    }

    if (inventoryFull) {
      return (
        <span className="text-xxs sm:text-xs my-1 text-center">
          {`Max ${max} ${selected.name}s`}
        </span>
      );
    }

    if (CONFIG.NETWORK === "mainnet" || selected.name !== "Magic Bean") {
      return (
        <span className="text-xs text-center mb-2 whitespace-nowrap">
          Coming soon
        </span>
      );
    }

    return (
      <>
        <Button
          disabled={
            lessFunds() ||
            lessIngredients() ||
            stock?.lessThan(1) ||
            inventoryFull
          }
          className="text-xxs sm:text-xs mt-1"
          onClick={() => buy(1)}
        >
          Buy 1
        </Button>
      </>
    );
  };

  const ingredientCount = getKeys(selected.ingredients).length;

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1">
        <div className="flex flex-wrap h-fit">
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
      </div>
      <OuterPanel className="flex flex-col w-full sm:flex-1">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 relative">
          {labelState()}
          <div className="flex items-center space-x-2 mt-1 sm:flex-col-reverse">
            <img
              src={ITEM_DETAILS[selected.name].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selected.name}
            />
            <span className="sm:text-center mb-1">{selected.name}</span>
          </div>
          <div className="border-t border-white w-full my-2" />
          <div className="flex w-full justify-between px-1 max-h-14 sm:max-h-full sm:flex-col sm:items-center">
            <div className="flex flex-col flex-wrap sm:flex-nowrap w-[70%] sm:w-auto">
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

                // rendering item remnants
                const renderRemnants = () => {
                  if (lessIngredient) {
                    return (
                      <Label type="danger">{`${inventoryAmount}/${requiredAmount}`}</Label>
                    );
                  } else {
                    // if inventory items is equal to required items
                    return (
                      <span className="text-xs text-center">
                        {`${requiredAmount}`}
                      </span>
                    );
                  }
                };

                return (
                  <div
                    className={`flex items-center space-x-1 ${
                      ingredientCount > 2 ? "w-1/2" : "w-full"
                    } shrink-0 sm:justify-center my-[1px] sm:w-full sm:mb-1`}
                    key={index}
                  >
                    <img src={item.image} className="h-5 me-2" />
                    {renderRemnants()}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col space-y-2 items-start w-[30%] sm:w-full sm:items-center sm:mb-1">
              <div className="flex space-x-1">
                <img src={SUNNYSIDE.icons.timer} className="h-4 sm:h-5" />
                <span className="text-xs text-center">
                  {secondsToString(selected.plantSeconds, {
                    length: "medium",
                    isShortFormat: true,
                  })}
                </span>
              </div>
              <div className="flex items-end space-x-1">
                <img src={token} className="h-4 sm:h-5" />
                {lessFunds() ? (
                  <Label type="danger">{`${price}`}</Label>
                ) : (
                  <span className={classNames("text-xs text-center")}>
                    {`${price}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
