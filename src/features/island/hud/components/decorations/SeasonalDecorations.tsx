import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import {
  Decoration,
  SeasonalDecorationName,
  SEASONAL_DECORATIONS,
} from "features/game/types/decorations";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  onClose: () => void;
}

export const SeasonalDecorations: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] =
    useState<SeasonalDecorationName>("Clementine");

  const selected = SEASONAL_DECORATIONS()[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const inventory = state.inventory;

  const price = selected.sfl;

  const landscapingMachine = gameService.state.children
    .landscaping as MachineInterpreter;

  const buy = () => {
    landscapingMachine.send("SELECT", {
      action: "decoration.bought",
      placeable: selected.name,
      requirements: {
        sfl: selected.sfl,
        ingredients: selected.ingredients,
      },
      multiple: true,
      maximum: selected.limit,
    });

    onClose();
  };

  const lessFunds = () => {
    if (!price) return false;

    return state.balance.lessThan(price.toString());
  };

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const maxCrafted = () =>
    !!selected.limit && inventory[selectedName]?.gte(selected.limit);
  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selected.name,
          }}
          requirements={{
            resources: selected.ingredients,
            sfl: price,
          }}
          limit={selected.limit}
          actionView={
            maxCrafted() ? (
              <div className="flex items-center justify-center">
                <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-2" />
                <span className="text-xs">Already crafted</span>
              </div>
            ) : (
              <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
                Buy
              </Button>
            )
          }
        />
      }
      content={
        <>
          {Object.values(SEASONAL_DECORATIONS()).map((item: Decoration) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() =>
                setSelectedName(item.name as SeasonalDecorationName)
              }
              image={ITEM_DETAILS[item.name].image}
            />
          ))}

          <div className="flex mt-1">
            <img src={SUNNYSIDE.icons.timer} className="h-4 mr-1" />
            <p className="text-xs">Available until the end of the season.</p>
          </div>
        </>
      }
    />
  );
};
