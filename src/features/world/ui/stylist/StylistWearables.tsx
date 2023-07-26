import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";

import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import {
  STYLIST_WEARABLES,
  ShopWearables,
  StylistWearable,
} from "features/game/types/stylist";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { formatDateRange } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC } from "features/island/bumpkin/components/NPC";

function isNotReady(name: BumpkinItem, farmCreatedAt: number) {
  const wearable = STYLIST_WEARABLES[name] as StylistWearable;

  if (wearable.hoursPlayed) {
    console.log({ hours: wearable.hoursPlayed });
    const hoursPlayed = (Date.now() - farmCreatedAt) / 1000 / 60 / 60;

    if (hoursPlayed < wearable.hoursPlayed) {
      return true;
    }
  }

  return (
    wearable.from &&
    wearable.to &&
    (wearable.from.getTime() > Date.now() || wearable.to.getTime() < Date.now())
  );
}
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
    if (state.wardrobe[selected])
      return (
        <div className="flex justify-center items-center">
          <span className="text-xs">Already crafted</span>
          <img src={SUNNYSIDE.icons.confirm} className="h-4 ml-1" />
        </div>
      );

    if (wearable.requiresItem && !state.inventory[wearable.requiresItem]) {
      return (
        <Label type="danger">
          <div className="flex items-center justify-center">
            <img
              src={ITEM_DETAILS[wearable.requiresItem].image}
              className="h-6 mr-1 img-highlight"
            />
            <span className="text-center">{`Requires ${wearable.requiresItem}`}</span>
          </div>
        </Label>
      );
    }

    return (
      <Button
        disabled={
          isNotReady(selected, state.createdAt) ||
          lessFunds() ||
          lessIngredients()
        }
        onClick={buy}
      >
        Craft
      </Button>
    );
  };

  return (
    <SplitScreenView
      panel={
        <div className="flex flex-col justify-center">
          {wearable.from && (
            <Label type="warning" className="my-1 mx-auto">
              <div className="flex items-center">
                <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
                <span className="text-xs">
                  {" "}
                  {formatDateRange(wearable.from, wearable.to as Date)}
                </span>
              </div>
            </Label>
          )}
          <p className="text-sm text-center">{selected}</p>

          <div className="relative w-4/5 mx-auto my-2 rounded-lg">
            <img
              src={getImageUrl(ITEM_IDS[selected])}
              className="w-4/5 mx-auto my-2 rounded-lg"
            />
            <div className="absolute bottom-14 w-4 h-4 right-8">
              <NPC
                key={selected}
                parts={{
                  body: "Beige Farmer Potion",
                  hair: "Sun Spots",
                  [BUMPKIN_ITEM_PART[selected]]: selected,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center mb-1">
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
          {getKeys(wearables).map((item) => {
            const timeLimited = isNotReady(item, state.createdAt);

            return (
              <Box
                isSelected={selected === item}
                key={item}
                onClick={() => setSelected(item)}
                image={getImageUrl(ITEM_IDS[item])}
                count={new Decimal(state.wardrobe[item] ?? 0)}
                showOverlay={timeLimited}
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
