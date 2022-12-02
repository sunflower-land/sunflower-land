import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import heart from "assets/icons/level_up.png";
import watch from "assets/icons/stopwatch.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { Consumable, ConsumableName } from "features/game/types/consumables";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import {
  getCookingTime,
  getFoodExpBoost,
} from "features/game/expansion/lib/boosts";
import { Bumpkin } from "features/game/types/game";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";
import { InProgressInfo } from "../building/InProgressInfo";
import { MachineInterpreter } from "../../lib/craftingMachine";

interface Props {
  recipes: Consumable[];
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
  craftingService?: MachineInterpreter;
  crafting: boolean;
}

export const Recipes: React.FC<Props> = ({
  recipes,
  onClose,
  onCook,
  crafting,
  craftingService,
}) => {
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

    onClose();
  };

  const Action = () => {
    return (
      <>
        <Button
          disabled={lessIngredients() || crafting}
          className="text-sm mt-1 whitespace-nowrap"
          onClick={() => cook()}
        >
          Cook
        </Button>
        {crafting && <p className="text-xs my-1">Chef is busy</p>}
      </>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1"
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
      >
        {craftingService && (
          <InProgressInfo craftingService={craftingService} onClose={onClose} />
        )}
        {crafting && <p className="mb-2">Recipes</p>}
        <div className="flex flex-wrap h-fit">
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
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-center p-2 relative">
          {/* <Stock item={selected} /> */}
          <span className="text-center mb-1">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-center mt-2 text-sm">
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

              // rendering item remnants
              const renderRemnants = () => {
                if (lessIngredient) {
                  // if inventory items is less than required items
                  return (
                    <Label type="danger">
                      {`${inventoryAmount}/${requiredAmount}`}
                    </Label>
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
                  {renderRemnants()}
                </div>
              );
            })}
          </div>
          <div className="flex mt-2 items-center">
            <img src={heart} className="h-5 mr-2" />
            <span className="text-xs">
              {getFoodExpBoost(selected, state.bumpkin as Bumpkin)} exp
            </span>
          </div>
          <div className="flex mt-2 items-center">
            <img src={watch} className="h-5 mr-2" />
            <span className="text-xs">
              {secondsToString(
                getCookingTime(selected.cookingSeconds, state.bumpkin),
                {
                  length: "medium",
                  removeTrailingZeros: true,
                }
              )}
            </span>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
