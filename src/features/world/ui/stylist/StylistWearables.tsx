import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";

import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  STYLIST_WEARABLES,
  StylistWearable,
} from "features/game/types/stylist";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";

export const StylistWearables: React.FC = () => {
  const [selected, setSelected] = useState<BumpkinItem>("Red Farmer Shirt");
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const wearable = STYLIST_WEARABLES[selected] as StylistWearable;

  const price = wearable.sfl;

  const lessFunds = () => {
    if (!price) return false;

    return state.balance.lessThan(price.toString());
  };

  const lessIngredients = () =>
    getKeys(wearable.ingredients).some((name) =>
      wearable.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const buy = () => {
    gameService.send("wearable.bought", {
      name: selected,
    });
  };

  return (
    <SplitScreenView
      panel={
        <div>
          <p className="text-sm text-center">{selected}</p>
          <img
            src={getImageUrl(ITEM_IDS[selected])}
            className="w-4/5 mx-auto my-2 rounded-lg"
          />
          <div className="flex flex-col items-center">
            <RequirementLabel
              type="sfl"
              balance={state.balance}
              requirement={new Decimal(wearable.sfl)}
            />
            {getKeys(wearable.ingredients).map((ingredientName, index) => (
              <RequirementLabel
                key={index}
                type="item"
                item={ingredientName}
                balance={state.inventory[ingredientName] ?? new Decimal(0)}
                requirement={
                  (wearable.ingredients ?? {})[ingredientName] ?? new Decimal(0)
                }
              />
            ))}
          </div>
          <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
            Craft
          </Button>
        </div>
      }
      content={
        <>
          {getKeys(STYLIST_WEARABLES).map((item) => (
            <Box
              isSelected={selected === item}
              key={item}
              onClick={() => setSelected(item)}
              image={getImageUrl(ITEM_IDS[item])}
              count={new Decimal(state.wardrobe[item] ?? 0)}
            />
          ))}
        </>
      }
    />
  );
};
