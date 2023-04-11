import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

import { Button } from "components/ui/Button";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { BUILDINGS, BuildingName } from "features/game/types/buildings";

export const Buildings: React.FC = () => {
  const [selectedName, setSelectedName] = useState<BuildingName>("Market");
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = BUILDINGS()[selectedName];
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const lessIngredients = () =>
    selectedItem[0].ingredients.some((ingredient) =>
      ingredient.amount?.greaterThan(inventory[ingredient.item] || 0)
    );

  const craft = () => {
    gameService.send("collectible.crafted", {
      name: selectedName,
    });

    selectedItem[0].ingredients.map((ingredient) => {
      setToast({
        icon: ITEM_DETAILS[ingredient.item].image,
        content: `-${ingredient.amount}`,
      });
    });
    setToast({
      icon: ITEM_DETAILS[selectedName].image,
      content: "+1",
    });

    shortcutItem(selectedName);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
          }}
          // boost={selectedItem[0]}
          requirements={{
            // resources: selectedItem[0].ingredients,
            resources: {},
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-1">Already crafted!</p>
            ) : (
              <Button disabled={lessIngredients()} onClick={craft}>
                Craft
              </Button>
            )
          }
        />
      }
      content={
        <>
          {getKeys(BUILDINGS()).map((name: BuildingName) => (
            <Box
              isSelected={selectedName === name}
              key={name}
              onClick={() => setSelectedName(name)}
              image={ITEM_DETAILS[name].image}
              count={inventory[name]}
            />
          ))}
        </>
      }
    />
  );
};
