import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import tokenStatic from "assets/icons/token_2.png";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import {
  Decoration,
  HELIOS_DECORATIONS,
} from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

export const DecorationItems: React.FC = () => {
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

  const lessFunds = () => {
    if (!price) return false;

    return state.balance.lessThan(price.toString());
  };

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const buy = () => {
    gameService.send("decoration.bought", {
      item: selected.name,
    });

    setToast({
      icon: tokenStatic,
      content: `-${selected.sfl?.toString()}`,
    });
    getKeys(selected.ingredients).map((name) => {
      const ingredient = ITEM_DETAILS[name];
      setToast({
        icon: ingredient.image,
        content: `-${selected.ingredients[name]}`,
      });
    });
    setToast({
      icon: ITEM_DETAILS[selected.name].image,
      content: "+1",
    });

    shortcutItem(selected.name);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selected.name,
          }}
          requirements={{
            sfl: price,
            resources: selected.ingredients,
          }}
          actionView={
            <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
              Buy
            </Button>
          }
        />
      }
      content={
        <>
          {Object.values(HELIOS_DECORATIONS()).map((item: Decoration) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() => setSelected(item)}
              image={ITEM_DETAILS[item.name].image}
              count={inventory[item.name]}
            />
          ))}
        </>
      }
    />
  );
};
