import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
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
import { RequirementLabel } from "components/ui/RequirementLabel";

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
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const price = selected.sfl || new Decimal(0);
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
    return state.balance.lessThan(price.toString());
  };

  const lessIngredients = () => {
    return getKeys(selected.ingredients).some((ingredientName) => {
      const inventoryAmount = inventory[ingredientName] || new Decimal(0);
      const requiredAmount =
        selected.ingredients[ingredientName] || new Decimal(0);
      return new Decimal(inventoryAmount).lessThan(requiredAmount);
    });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full sm:w-3/5 h-fit max-h-48 sm:max-h-96 overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
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
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selected.name].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selected.name}
            />
            <span className="sm:text-center mb-1">{selected.name}</span>
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
            {price.greaterThan(0) && (
              <RequirementLabel
                type="sfl"
                balance={state.balance}
                requirement={price}
              />
            )}
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
