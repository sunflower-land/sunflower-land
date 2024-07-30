import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Consumable, isJuice } from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";

import { SUNNYSIDE } from "assets/sunnyside";
import { Bumpkin } from "features/game/types/game";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { FeedBumpkinDetails } from "components/ui/layouts/FeedBumpkinDetails";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  food: Consumable[];
}

const _inventory = (state: MachineState) => state.context.state.inventory;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _game = (state: MachineState) => state.context.state;
const _buds = (state: MachineState) => state.context.state.buds;

export const Feed: React.FC<Props> = ({ food }) => {
  const [selected, setSelected] = useState<Consumable | undefined>(food[0]);
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const bumpkin = useSelector(gameService, _bumpkin);
  const game = useSelector(gameService, _game);
  const buds = useSelector(gameService, _buds);
  const { t } = useAppTranslation();
  useEffect(() => {
    if (food.length) {
      setSelected(food[0]);
    } else {
      setSelected(undefined);
    }
  }, [food.length]);

  if (!selected) {
    return (
      <OuterPanel>
        <div className="flex flex-col items-center p-2">
          <span className="text-base text-center mb-4">{t("hungry?")}</span>
          <span className="w-full text-sm mb-3">
            {t("statements.feed.bumpkin.one")}
          </span>
          <span className="w-full text-sm mb-2">
            {t("statements.feed.bumpkin.two")}
          </span>
          <img
            src={SUNNYSIDE.building.firePit}
            className="my-2"
            alt={"Fire Pit"}
            style={{
              width: `${PIXEL_SCALE * 47}px`,
            }}
          />
        </div>
      </OuterPanel>
    );
  }

  const feed = (amount: number) => {
    if (!selected) return;

    const previousExperience = bumpkin?.experience ?? 0;
    let previousLevel: number = getBumpkinLevel(bumpkin?.experience ?? 0);

    const newState = gameService.send("bumpkin.feed", {
      food: selected.name,
      amount,
    });

    const currentLevel = getBumpkinLevel(
      newState.context.state.bumpkin?.experience ?? 0,
    );

    while (currentLevel > previousLevel) {
      previousLevel += 1;
      gameAnalytics.trackMilestone({
        event: `Bumpkin:LevelUp:Level${previousLevel}`,
      });
    }

    if (previousExperience === 0) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:BumpkinFed:Completed",
      });
    }
  };

  const inventoryFoodCount = inventory[selected.name] ?? new Decimal(0);
  const feedVerb = isJuice(selected.name) ? "Drink" : "Eat";

  return (
    <SplitScreenView
      panel={
        <FeedBumpkinDetails
          details={{
            item: selected.name,
          }}
          properties={{
            xp: new Decimal(
              getFoodExpBoost(selected, bumpkin as Bumpkin, game, buds ?? {}),
            ),
          }}
          actionView={
            <>
              <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                <Button
                  disabled={inventoryFoodCount.lessThan(1)}
                  onClick={() => feed(1)}
                >
                  {`${feedVerb} 1`}
                </Button>
                <Button
                  disabled={inventoryFoodCount.lessThan(10)}
                  onClick={() => feed(10)}
                >
                  {`${feedVerb} 10`}
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
