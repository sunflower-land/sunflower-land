import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import {
  Decoration,
  LandscapingDecorationName,
  LANDSCAPING_DECORATIONS,
} from "features/game/types/decorations";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { gameAnalytics } from "lib/gameAnalytics";

interface Props {
  onClose: () => void;
}

export const LandscapingDecorations: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] =
    useState<LandscapingDecorationName>("Bush");

  const selected = LANDSCAPING_DECORATIONS()[selectedName];
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
    });

    if (selected.ingredients["Block Buck"]) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: selected.ingredients["Block Buck"].toNumber() ?? 1,
        item: selected.name,
        type: "Collectible",
      });
    }

    if (selected.sfl) {
      gameAnalytics.trackSink({
        currency: "SFL",
        amount: selected.sfl.toNumber(),
        item: selected.name,
        type: "Collectible",
      });
    }

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
          actionView={
            <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
              Buy
            </Button>
          }
        />
      }
      content={
        <>
          {Object.values(LANDSCAPING_DECORATIONS()).map((item: Decoration) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() =>
                setSelectedName(item.name as LandscapingDecorationName)
              }
              image={ITEM_DETAILS[item.name].image}
            />
          ))}
          <span className="text-xxs mt-2">
            Travel to the plaza to craft rare decorations!
          </span>
        </>
      }
    />
  );
};
