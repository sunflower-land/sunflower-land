import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Consumable, isJuice } from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";

import { SUNNYSIDE } from "assets/sunnyside";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { FeedBumpkinDetails } from "components/ui/layouts/FeedBumpkinDetails";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  food: Consumable[];
}

const _inventory = (state: MachineState) => state.context.state.inventory;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _game = (state: MachineState) => state.context.state;

export const Feed: React.FC<Props> = ({ food }) => {
  const [selected, setSelected] = useState<Consumable | undefined>(food[0]);
  const [showBoosts, setShowBoosts] = useState(false);
  const { gameService } = useContext(Context);
  const now = useNow({ live: true });
  const inventory = useSelector(gameService, _inventory);
  const bumpkin = useSelector(gameService, _bumpkin);
  const game = useSelector(gameService, _game);
  const { t } = useAppTranslation();
  // Derive the "active" selected food from the current props so that
  // we never point at a food item that is no longer available.
  const activeSelected =
    food.find((item) => item.name === selected?.name) ?? food[0];

  const inventoryFoodCount = activeSelected
    ? (inventory[activeSelected.name] ?? new Decimal(0))
    : new Decimal(0);

  const feedVerb = activeSelected
    ? isJuice(activeSelected.name)
      ? t("drink")
      : t("eat")
    : "";

  if (!activeSelected) {
    return (
      <InnerPanel>
        <div className="flex flex-col p-2">
          <Label type="warning">{t("statements.feed.bumpkin.one")}</Label>
          <span className="w-full my-2">
            {t("statements.feed.bumpkin.two")}
          </span>
          <div className="flex flex-col items-center">
            <img
              src={SUNNYSIDE.building.firePit}
              className="my-2"
              alt={"Fire Pit"}
              style={{
                width: `${PIXEL_SCALE * 47}px`,
              }}
            />
          </div>
        </div>
      </InnerPanel>
    );
  }

  const feed = (amount: number) => {
    if (!activeSelected) return;

    const previousExperience = bumpkin?.experience ?? 0;
    let previousLevel: number = getBumpkinLevel(bumpkin?.experience ?? 0);

    const newState = gameService.send({
      type: "bumpkin.feed",
      food: activeSelected.name,
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

  const { boostedExp, boostsUsed } = getFoodExpBoost({
    food: activeSelected,
    game,
    createdAt: now,
  });

  return (
    <SplitScreenView
      panel={
        <FeedBumpkinDetails
          details={{
            item: activeSelected.name,
          }}
          properties={{
            xp: boostedExp,
            baseXp: activeSelected.experience,
            boostsUsed,
            showBoosts,
            setShowBoosts,
            gameState: game,
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
              isSelected={activeSelected?.name === item.name}
              key={item.name}
              onClick={() => {
                setSelected(item);
                setShowBoosts(false);
              }}
              image={ITEM_DETAILS[item.name].image}
              count={inventory[item.name]}
            />
          ))}
        </>
      }
    />
  );
};
