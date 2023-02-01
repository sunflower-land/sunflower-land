import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import {
  Decoration,
  HELIOS_DECORATIONS,
} from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

interface Props {
  onClose: () => void;
}

export const DecorationItems: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<Decoration>(
    HELIOS_DECORATIONS()["White Tulips"]
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
  const buy = () => {
    gameService.send("decoration.bought", {
      item: selected.name,
    });

    setToast({
      icon: tokenStatic,
      content: `-${selected.sfl?.toString()}`,
    });

    shortcutItem(selected.name);
  };

  const lessFunds = () => {
    if (!price) return false;

    return state.balance.lessThan(price.toString());
  };

  const renderRemnants = (
    missingIngredients: boolean,
    inventoryAmount: Decimal,
    requiredAmount: Decimal
  ) => {
    if (missingIngredients) {
      // if inventory items is less than required items
      return (
        <Label type="danger">{`${inventoryAmount}/${requiredAmount}`}</Label>
      );
    } else {
      // if inventory items is equal to required items
      return <span className="text-xs text-center">{`${requiredAmount}`}</span>;
    }
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

  // Price is added as an ingredient for layout purposes
  const ingredientCount = getKeys(selected.ingredients).length + 1;

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full sm:w-3/5 h-fit max-h-48 sm:max-h-96 overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {Object.values(HELIOS_DECORATIONS).map((item: Decoration) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selected.name].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selected.name}
            />
            <span className="sm:text-center mb-1">{selected.name}</span>
          </div>
          <div className="border-t border-white w-full my-2" />
          <div className="flex w-full justify-between max-h-14 sm:max-h-full sm:flex-col sm:items-center">
            <div className="mb-1 flex flex-wrap sm:flex-nowrap w-[70%] sm:w-auto">
              <div className="flex items-center space-x-1 shrink-0 w-1/2 sm:w-full sm:justify-center my-[1px] sm:mb-1">
                <div className="w-5">
                  <img src={token} className="h-5 mr-1" />
                </div>
                <span
                  className={classNames("text-xs text-center", {
                    "text-red-500": lessFunds(),
                  })}
                >
                  {`${price}`}
                </span>
              </div>
              {getKeys(selected.ingredients).map((ingredientName, index) => {
                const item = ITEM_DETAILS[ingredientName];
                const inventoryAmount =
                  inventory[ingredientName]?.toDecimalPlaces(1) ||
                  new Decimal(0);
                const requiredAmount =
                  selected.ingredients[ingredientName]?.toDecimalPlaces(1) ||
                  new Decimal(0);

                // Ingredient difference
                const lessIngredient = new Decimal(inventoryAmount).lessThan(
                  requiredAmount
                );

                return (
                  <div
                    className={`flex items-center space-x-1 ${
                      ingredientCount > 2 ? "w-1/2" : "w-full"
                    } shrink-0 sm:justify-center my-[1px] sm:mb-1 sm:w-full`}
                    key={index}
                  >
                    <div className="w-5">
                      <img src={item.image} className="h-5" />
                    </div>
                    {renderRemnants(
                      lessIngredient,
                      inventoryAmount,
                      requiredAmount
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Button
          disabled={lessFunds() || lessIngredients()}
          className="text-xxs sm:text-xs mt-1"
          onClick={() => buy()}
        >
          Buy
        </Button>
      </OuterPanel>
    </div>
  );
};
