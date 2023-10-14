import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  Consumable,
  ConsumableName,
  isJuice,
} from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";

import firePit from "src/assets/buildings/fire_pit.png";
import { Bumpkin } from "features/game/types/game";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { FeedBumpkinDetails } from "components/ui/layouts/FeedBumpkinDetails";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  food: Consumable[];
  onFeed: (name: ConsumableName) => void;
}

export const Feed: React.FC<Props> = ({ food, onFeed }) => {
  const [selected, setSelected] = useState<Consumable | undefined>(food[0]);
  const { gameService } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  useEffect(() => {
    if (food.length) {
      setSelected(food[0]);
    } else {
      setSelected(undefined);
    }
  }, [food.length]);

  const feed = (amount: Decimal) => {
    if (selected) {
      gameService.send("bumpkin.feed", {
        food: selected.name,
        amount,
      });
    }
  };

  const handleFeedOne = () => {
    feed(new Decimal(1));
  };
  const handleFeedTen = () => {
    feed(new Decimal(10));
  };

  if (!selected) {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-base text-center mb-4">Hungry?</span>
        <span className="w-full text-sm mb-3">
          You have no food in your inventory.
        </span>
        <span className="w-full text-sm mb-2">
          You will need to cook food in order to feed your Bumpkin.
        </span>
        <img
          src={firePit}
          className="my-2"
          alt={"Fire Pit"}
          style={{
            width: `${PIXEL_SCALE * 47}px`,
          }}
        />
      </div>
    );
  }

  return (
    <SplitScreenView
      panel={
        <FeedBumpkinDetails
          details={{
            item: selected.name,
          }}
          properties={{
            xp: new Decimal(
              getFoodExpBoost(
                selected,
                state.bumpkin as Bumpkin,
                state.collectibles
              )
            ),
          }}
          actionView={
            <>
              <div className="flex space-x-1 mb-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                <Button
                  disabled={!inventory[selected.name]?.gt(0)}
                  onClick={handleFeedOne}
                >
                  {isJuice(selected.name) ? "Drink 1" : "Eat 1"}
                </Button>
                <Button
                  disabled={!inventory[selected.name]?.gte(10)} // Disable if less than 10
                  onClick={handleFeedTen}
                >
                  {isJuice(selected.name) ? "Drink 10" : "Eat 10"}
                </Button>
              </div>
            </>
          }
        />
      }
      content={
        <>
          {food.map((item) => (
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
