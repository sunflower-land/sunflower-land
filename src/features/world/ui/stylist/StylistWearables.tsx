import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";

import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  LIMITED_WEARABLES,
  STYLIST_WEARABLES,
  ShopWearables,
  StylistWearable,
} from "features/game/types/stylist";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  wearables: ShopWearables;
}
export const StylistWearables: React.FC<Props> = ({ wearables }) => {
  const [selected, setSelected] = useState<BumpkinItem>(getKeys(wearables)[0]);
  const { gameService } = useContext(Context);
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
      (inventory[name] || new Decimal(0))?.lt(wearable.ingredients[name] ?? 0)
    );

  const buy = () => {
    gameService.send("wearable.bought", {
      name: selected,
    });
  };

  const Action = () => {
    if (selected in LIMITED_WEARABLES) {
      return (
        <div className="flex justify-center">
          <span className="text-center text-xs">Coming soon...</span>
        </div>
      );
    }

    if (state.wardrobe[selected])
      return (
        <div className="flex justify-center items-center">
          <span className="text-xs">Already crafted</span>
          <img src={SUNNYSIDE.icons.confirm} className="h-4 ml-1" />
        </div>
      );

    return (
      <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
        Craft
      </Button>
    );
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
                  new Decimal(wearable.ingredients?.[ingredientName] ?? 0)
                }
              />
            ))}
          </div>
          <Action />
        </div>
      }
      content={
        <>
          {getKeys(wearables).map((item) => (
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
