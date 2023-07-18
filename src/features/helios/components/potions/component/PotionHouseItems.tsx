import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  Decoration,
  HELIOS_DECORATIONS,
  POTION_HOUSE_DECORATIONS,
} from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

export const PotionHouseItems: React.FC = () => {
  const [selected, setSelected] = useState<Decoration>(
    POTION_HOUSE_DECORATIONS()["Giant Potato"]
  );
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
      name: selected.name,
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
          {Object.values(HELIOS_DECORATIONS())
            .filter((item) => !ADVANCED_DECORATIONS.includes(item.name))
            .map((item: Decoration) => (
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
