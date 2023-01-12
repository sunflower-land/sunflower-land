import React, { Dispatch, SetStateAction, useContext } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import {
  Consumable,
  ConsumableName,
  CONSUMABLES,
} from "features/game/types/consumables";
import { InProgressInfo } from "../building/InProgressInfo";
import { MachineInterpreter } from "../../lib/craftingMachine";
import {
  getCookingTime,
  getFoodExpBoost,
} from "features/game/expansion/lib/boosts";
import { Bumpkin } from "features/game/types/game";
import { RequirementLabel } from "components/ui/RequirementLabel";

interface Props {
  selected: Consumable;
  setSelected: Dispatch<SetStateAction<Consumable>>;
  recipes: Consumable[];
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
  craftingService?: MachineInterpreter;
  crafting: boolean;
}

/**
 * The recipes of a food producing building.
 * @selected The selected food in the interface. This prop is set in the parent so closing the modal will not reset the selected state.
 * @setSelected Sets the selected food in the interface. This prop is set in the parent so closing the modal will not reset the selected state.
 * @recipes The list of available recipes.
 * @onClose The close action.
 * @onCook The cook action.
 * @crafting Whether the building is in the process of crafting a food item.
 * @craftingService The crafting service.
 */
export const Recipes: React.FC<Props> = ({
  selected,
  setSelected,
  recipes,
  onClose,
  onCook,
  crafting,
  craftingService,
}) => {
  const { setToast } = useContext(ToastContext);
  const { gameService } = useContext(Context);

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
        {crafting && (
          <p className="text-xxs sm:text-xs text-center my-1">Chef is busy</p>
        )}
        <Button
          disabled={lessIngredients() || crafting || selected.disabled}
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={() => cook()}
        >
          Cook
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1">
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
      <OuterPanel className="flex flex-col w-full sm:flex-1">
        <div className="flex p-1 items-end">
          <div className="flex flex-col justify-between w-full sm:items-center">
            <div className="flex items-center space-x-2 sm:flex-col-reverse">
              <img
                src={ITEM_DETAILS[selected.name].image}
                className="h-6 img-highlight mt-1 sm:h-12"
                alt={selected.name}
              />
              <p className="sm:text-center sm:mb-1">{selected.name}</p>
            </div>
            <span className="text-xxs mt-2 sm:text-center">
              {CONSUMABLES[selected.name].description}
            </span>
          </div>
        </div>

        <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
          {getKeys(selected.ingredients).map((ingredientName, index) => (
            <RequirementLabel
              key={index}
              type="item"
              item={ingredientName}
              balance={inventory[ingredientName] || new Decimal(0)}
              requirement={
                selected.ingredients?.[ingredientName] || new Decimal(0)
              }
            />
          ))}
          <RequirementLabel
            type="xp"
            xp={
              new Decimal(
                getFoodExpBoost(
                  selected,
                  state.bumpkin as Bumpkin,
                  state.collectibles
                )
              )
            }
          />
          <RequirementLabel
            type="time"
            waitSeconds={getCookingTime(selected.cookingSeconds, state.bumpkin)}
          />
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
