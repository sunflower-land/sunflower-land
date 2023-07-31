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
  CraftableCollectible,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

function isNotReady(collectible: CraftableCollectible) {
  return (
    collectible.from &&
    collectible.to &&
    (collectible.from.getTime() > Date.now() ||
      collectible.to.getTime() < Date.now())
  );
}
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

  const selectedItem = HELIOS_BLACKSMITH_ITEMS(state)[selectedName];
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
            from: selectedItem.from,
            to: selectedItem.to,
          }}
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
            sfl: selectedItem.sfl,
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-1">Already crafted!</p>
            ) : (
              <Button
                disabled={lessIngredients() || isNotReady(selectedItem)}
                onClick={craft}
              >
                Craft
              </Button>
            )
          }
        />
      }
      content={
        <>
          {getKeys(HELIOS_BLACKSMITH_ITEMS(state)).map(
            (name: HeliosBlacksmithItem) => {
              const isTimeLimited = isNotReady(
                HELIOS_BLACKSMITH_ITEMS(state)[name]
              );

              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_DETAILS[name].image}
                  count={inventory[name]}
                  showOverlay={isTimeLimited}
                  overlayIcon={
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      id="confirm"
                      alt="confirm"
                      className="object-contain absolute"
                      style={{
                        width: `${PIXEL_SCALE * 8}px`,
                        top: `${PIXEL_SCALE * -4}px`,
                        right: `${PIXEL_SCALE * -4}px`,
                      }}
                    />
                  }
                />
              );
            }
          )}
        </>
      }
    />
  );
};
