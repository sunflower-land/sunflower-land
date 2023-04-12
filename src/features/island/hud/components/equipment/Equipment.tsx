import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

import { Button } from "components/ui/Button";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import Decimal from "decimal.js-light";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";

interface Props {
  onClose: () => void;
}

export const Equipment: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] =
    useState<HeliosBlacksmithItem>("Immortal Pear");
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = HELIOS_BLACKSMITH_ITEMS[selectedName];
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const landscapingMachine = gameService.state.children
    .landscaping as MachineInterpreter;

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const craft = () => {
    landscapingMachine.send("SELECT", {
      action: "collectible.crafted",
      placeable: selectedName,
      requirements: {
        sfl: new Decimal(0),
        ingredients: selectedItem.ingredients,
      },
    });

    onClose();
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
          {getKeys(HELIOS_BLACKSMITH_ITEMS).map(
            (name: HeliosBlacksmithItem) => (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ITEM_DETAILS[name].image}
                count={inventory[name]}
              />
            )
          )}
        </>
      }
    />
  );
};
