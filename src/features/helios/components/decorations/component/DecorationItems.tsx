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
  DecorationName,
  DECORATIONS,
} from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

interface Props {
  onClose: () => void;
}

export const DecorationItems: React.FC<Props> = ({ onClose }) => {
  // Only display the decorations available for purchase
  const availableDecorations = getKeys(DECORATIONS()).reduce((acc, name) => {
    const decoration = DECORATIONS()[name];
    if (!decoration.sfl) {
      return acc;
    }

    return { ...acc, [name]: decoration };
  }, {} as Record<DecorationName, Decoration>);

  const [selected, setSelected] = useState<Decoration>(
    DECORATIONS()["White Tulips"]
  );
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
      value,
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

  const renderRemenants = (
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
      return (
        <span className="text-xs text-center mt-2">{`${requiredAmount}`}</span>
      );
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

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
      >
        {Object.values(availableDecorations).map((item: Decoration) => (
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
        <div className="flex flex-col justify-center items-center p-2 relative">
          <span className="text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="w-8 sm:w-12 img-highlight mt-1"
            alt={selected.name}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            {getKeys(selected.ingredients).map((ingredientName, index) => {
              const item = ITEM_DETAILS[ingredientName];
              const inventoryAmount =
                inventory[ingredientName]?.toDecimalPlaces(1) || new Decimal(0);
              const requiredAmount =
                selected.ingredients[ingredientName]?.toDecimalPlaces(1) ||
                new Decimal(0);

              // Ingredient difference
              const lessIngredient = new Decimal(inventoryAmount).lessThan(
                requiredAmount
              );

              return (
                <div
                  className="flex justify-center flex-wrap items-end"
                  key={index}
                >
                  <img src={item.image} className="h-5 me-2" />
                  {renderRemenants(
                    lessIngredient,
                    inventoryAmount,
                    requiredAmount
                  )}
                </div>
              );
            })}
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-center mt-2", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`${price}`}
              </span>
            </div>
          </div>
          <Button
            disabled={lessFunds() || lessIngredients()}
            className="text-xs mt-1"
            onClick={() => buy()}
          >
            Buy
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
