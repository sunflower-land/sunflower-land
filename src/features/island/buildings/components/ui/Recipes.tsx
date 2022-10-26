import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { Consumable, ConsumableName } from "features/game/types/consumables";

interface Props {
  recipes: Consumable[];
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
}

export const Recipes: React.FC<Props> = ({ recipes, onClose, onCook }) => {
  const [selected, setSelected] = useState<Consumable>(recipes[0]);
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected?.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const cook = () => {
    onCook(selected.name);

    getKeys(selected.ingredients).map((name) => {
      const item = ITEM_DETAILS[name];
      setToast({
        icon: item.image,
        content: `-${selected.ingredients[name]}`,
      });
    });

    shortcutItem(selected.name);

    onClose();
  };

  const Action = () => {
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

    return (
      <>
        <Button
          disabled={lessIngredients()}
          // disabled={lessIngredients() || stock?.lessThan(1)}
          className="text-xxs sm:text-xs mt-1 whitespace-nowrap"
          onClick={() => cook()}
        >
          Cook
        </Button>
      </>
    );
  };

  const stock = state.stock[selected.name] || new Decimal(0);

  return (
    <div className="flex">
      <div className="w-1/2 flex flex-wrap h-fit">
        {recipes.map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/2">
        <div className="flex flex-col justify-center items-center p-2 relative">
          {/* <Stock item={selected} /> */}
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {ITEM_DETAILS[selected.name].description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1">
            {getKeys(selected.ingredients).map((name, index) => {
              const item = ITEM_DETAILS[name];
              const inventoryAmount = inventory[name]?.toDecimalPlaces(1) || 0;
              const requiredAmount =
                selected.ingredients[name]?.toDecimalPlaces(1) ||
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
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
