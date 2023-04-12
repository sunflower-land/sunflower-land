import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { BUILDINGS, BuildingName } from "features/game/types/buildings";

import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

import marketIcon from "assets/buildings/market_icon.png";
import firePitIcon from "assets/buildings/fire_pit_icon.png";
import workbenchIcon from "assets/buildings/workbench_icon.png";
import kitchenIcon from "assets/buildings/kitchen_icon.png";
import henHouseIcon from "assets/buildings/hen_house_icon.png";
import bakeryIcon from "assets/buildings/bakery_icon.png";
import deliIcon from "assets/buildings/deli_icon.png";
import smoothieIcon from "assets/buildings/smoothie_shack_icon.png";
import toolshedIcon from "assets/buildings/toolshed_icon.png";
import warehouseIcon from "assets/buildings/warehouse_icon.png";
import lock from "assets/skills/lock.png";

import Decimal from "decimal.js-light";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";

const ICONS: Partial<Record<BuildingName, string>> = {
  Market: marketIcon,
  "Fire Pit": firePitIcon,
  Workbench: workbenchIcon,
  Kitchen: kitchenIcon,
  "Hen House": henHouseIcon,
  Bakery: bakeryIcon,
  Deli: deliIcon,
  "Smoothie Shack": smoothieIcon,
  Toolshed: toolshedIcon,
  Warehouse: warehouseIcon,
};

interface Props {
  onClose: () => void;
}

export const Buildings: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] = useState<BuildingName>("Market");
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = BUILDINGS()[selectedName];
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const ingredients = selectedItem[0].ingredients.reduce(
    (acc, ingredient) => ({
      ...acc,
      [ingredient.item]: new Decimal(ingredient.amount),
    }),
    {}
  );

  const sfl = selectedItem[0].sfl;
  const landCount = state.inventory["Basic Land"] ?? new Decimal(0);

  const landscapingMachine = gameService.state.children
    .landscaping as MachineInterpreter;

  const lessIngredients = () =>
    selectedItem[0].ingredients.some((ingredient) =>
      ingredient.amount?.greaterThan(inventory[ingredient.item] || 0)
    );

  const craft = () => {
    landscapingMachine.send("SELECT", {
      action: "building.constructed",
      placeable: selectedName,
      requirements: {
        sfl,
        ingredients,
      },
    });

    onClose();
  };

  const action = () => {
    if (isAlreadyCrafted) {
      return <p className="text-xxs text-center mb-1">Already crafted!</p>;
    }
    return (
      <Button
        disabled={lessIngredients() || state.balance.lt(sfl)}
        onClick={craft}
      >
        Craft
      </Button>
    );
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
          }}
          requirements={{
            sfl,
            // resources: selectedItem[0].ingredients,
            resources: selectedItem[0].ingredients.reduce(
              (acc, ingredient) => ({
                ...acc,
                [ingredient.item]: new Decimal(ingredient.amount),
              }),
              {}
            ),
          }}
          actionView={action()}
        />
      }
      content={
        <>
          {getKeys(BUILDINGS()).map((name: BuildingName) => {
            const isLocked = landCount.lt(BUILDINGS()[name][0].unlocksAtLevel);
            return (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ICONS[name] ?? ITEM_DETAILS[name].image}
                secondaryImage={isLocked ? lock : undefined}
                showOverlay={isLocked}
              />
            );
          })}
        </>
      }
    />
  );
};
