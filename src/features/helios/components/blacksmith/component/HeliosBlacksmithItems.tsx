import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { hasFeatureAccess } from "lib/flags";

export const HeliosBlacksmithItems: React.FC = () => {
  const [selectedName, setSelectedName] =
    useState<HeliosBlacksmithItem>("Immortal Pear");
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = HELIOS_BLACKSMITH_ITEMS[selectedName];
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const craft = () => {
    gameService.send("collectible.crafted", {
      name: selectedName,
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
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
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
          {getKeys(HELIOS_BLACKSMITH_ITEMS)
            .filter(
              (name: HeliosBlacksmithItem) =>
                (name !== "Scary Mike" ||
                  hasFeatureAccess(state.inventory, "SCARY_MIKE")) &&
                (name !== "Laurie the Chuckle Crow" ||
                  hasFeatureAccess(state.inventory, "LAURIE"))
            )
            .map((name: HeliosBlacksmithItem) => (
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
