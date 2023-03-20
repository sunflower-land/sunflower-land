import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { Stock } from "components/ui/Stock";

interface Props {
  onClose: () => void;
}

export const HeliosBlacksmithItems: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] =
    useState<HeliosBlacksmithItem>("Immortal Pear");
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
      value,
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const item = HELIOS_BLACKSMITH_ITEMS[selected];
  const isAlreadyCrafted = state.inventory[selected]?.greaterThanOrEqualTo(1);

  const craft = () => {
    gameService.send("collectible.crafted", {
      name: selected,
    });

    getKeys(item.ingredients).map((name) => {
      const ingredient = ITEM_DETAILS[name];
      setToast({
        icon: ingredient.image,
        content: `-${item.ingredients[name]}`,
      });
    });
    setToast({
      icon: ITEM_DETAILS[selected].image,
      content: "+1",
    });

    shortcutItem(selected);
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

  const stock = state.stock[selected] || new Decimal(0);

  const labelState = () => {
    const max = INITIAL_STOCK(state)[selected];
    const inventoryCount = inventory[selected] ?? new Decimal(0);
    const inventoryFull = max ? inventoryCount.gt(max) : true;

    if (stock?.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }

    return <Stock item={{ name: selected }} inventoryFull={inventoryFull} />;
  };

  const lessIngredients = () => {
    return getKeys(item.ingredients).some((ingredientName) => {
      const inventoryAmount =
        inventory[ingredientName]?.toDecimalPlaces(1) || new Decimal(0);
      const requiredAmount =
        item.ingredients[ingredientName]?.toDecimalPlaces(1) || new Decimal(0);
      return new Decimal(inventoryAmount).lessThan(requiredAmount);
    });
  };

  // Price is added as an ingredient for layout purposes
  const ingredientCount = getKeys(item.ingredients).length + 1;

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full sm:w-3/5 h-fit max-h-48 sm:max-h-96 overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {getKeys(HELIOS_BLACKSMITH_ITEMS).map((name: HeliosBlacksmithItem) => (
          <Box
            isSelected={selected === name}
            key={name}
            onClick={() => setSelected(name)}
            image={ITEM_DETAILS[name].image}
            count={inventory[name]}
          />
        ))}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          {labelState()}
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selected].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selected}
            />
            <span className="sm:text-center mb-1">{selected}</span>
          </div>
          <span className="text-xs sm:text-center mb-1">
            {item.description}
          </span>

          <Label className="mt-1 md:text-center" type="info">
            {item.boost}
          </Label>

          <div className="border-t border-white w-full my-2" />
          <div className="flex w-full justify-between max-h-14 sm:max-h-full sm:flex-col sm:items-center">
            <div className="mb-1 flex flex-wrap sm:flex-nowrap w-[70%] sm:w-auto">
              {getKeys(item.ingredients).map((ingredientName, index) => {
                const details = ITEM_DETAILS[ingredientName];
                const inventoryAmount =
                  inventory[ingredientName]?.toDecimalPlaces(1) ||
                  new Decimal(0);
                const requiredAmount =
                  item.ingredients?.[ingredientName]?.toDecimalPlaces(1) ||
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
                      <img src={details.image} className="h-5" />
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
        {isAlreadyCrafted ? (
          <p className="text-xxs sm:text-xs text-center my-1">
            Already crafted!
          </p>
        ) : (
          <Button
            disabled={stock?.lessThan(1) || lessIngredients()}
            className="text-xxs sm:text-xs mt-1"
            onClick={() => craft()}
          >
            Craft
          </Button>
        )}
      </OuterPanel>
    </div>
  );
};
