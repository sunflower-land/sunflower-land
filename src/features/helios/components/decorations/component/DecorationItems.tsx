import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decoration, DecorationName } from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

function isNotReady(collectible: Decoration) {
  return (
    collectible.from &&
    collectible.to &&
    (collectible.from.getTime() > Date.now() ||
      collectible.to.getTime() < Date.now())
  );
}

const ADVANCED_DECORATIONS: DecorationName[] = [
  "Fence",
  "Dirt Path",
  "Bush",
  "Shrub",
  "Pine Tree",
  "Stone Fence",
  "Field Maple",
  "Red Maple",
  "Golden Maple",
];

interface Props {
  items: Partial<Record<DecorationName, Decoration>>;
}
export const DecorationItems: React.FC<Props> = ({ items }) => {
  const [selected, setSelected] = useState<Decoration>(
    items[getKeys(items)[0]] as Decoration
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
            from: selected.from,
            to: selected.to,
          }}
          requirements={{
            resources: selected.ingredients,
            sfl: price,
          }}
          actionView={
            <Button
              disabled={
                isNotReady(selected) || lessFunds() || lessIngredients()
              }
              onClick={buy}
            >
              Buy
            </Button>
          }
        />
      }
      content={
        <>
          {Object.values(items)
            .filter((item) => !ADVANCED_DECORATIONS.includes(item.name))
            .map((item: Decoration) => {
              const isTimeLimited = isNotReady(items[item.name] as Decoration);

              return (
                <Box
                  isSelected={selected.name === item.name}
                  key={item.name}
                  onClick={() => setSelected(item)}
                  image={ITEM_DETAILS[item.name].image}
                  count={inventory[item.name]}
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
            })}
        </>
      }
    />
  );
};
