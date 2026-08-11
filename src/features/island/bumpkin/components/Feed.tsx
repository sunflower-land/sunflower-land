import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  type Consumable,
  type ConsumableName,
  isJuice,
} from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";

import { SUNNYSIDE } from "assets/sunnyside";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { FeedBumpkinDetails } from "components/ui/layouts/FeedBumpkinDetails";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import { getTotalBumpkinLevel } from "features/game/lib/level";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { useNow } from "lib/utils/hooks/useNow";
import {
  type FoodCategory,
  groupFoodByCategory,
} from "features/game/lib/availableFood";
import { BulkFeedModal } from "components/ui/BulkFeedModal";
import type { Equipped } from "features/game/types/bumpkin";

const FOOD_CATEGORY_ICONS: Record<FoodCategory, string> = {
  "Fire Pit": SUNNYSIDE.icons.firePitIcon,
  Kitchen: SUNNYSIDE.icons.kitchenIcon,
  Bakery: SUNNYSIDE.icons.bakeryIcon,
  Deli: SUNNYSIDE.icons.deliIcon,
  "Smoothie Shack": SUNNYSIDE.icons.smoothieIcon,
  special: ITEM_DETAILS["Pirate Cake"].image,
  fish: ITEM_DETAILS["Anchovy"].image,
  agedFish: ITEM_DETAILS["Aged Anchovy"].image,
};

const FOOD_CATEGORY_LABEL_KEYS: Record<
  FoodCategory,
  | "buildings.firePit"
  | "buildings.kitchen"
  | "buildings.bakery"
  | "buildings.deli"
  | "buildings.smoothieShack"
  | "special"
  | "fish"
  | "agedFish"
> = {
  "Fire Pit": "buildings.firePit",
  Kitchen: "buildings.kitchen",
  Bakery: "buildings.bakery",
  Deli: "buildings.deli",
  "Smoothie Shack": "buildings.smoothieShack",
  special: "special",
  fish: "fish",
  agedFish: "agedFish",
};

interface Props {
  food: Consumable[];
  selectedName: ConsumableName | undefined;
  setSelectedName: (name: ConsumableName) => void;
  // Lets the parent (which doesn't unmount when the LevelUp screen briefly
  // replaces Feed) preserve/restore this scrollable content panel's scroll
  // position across that mount/unmount cycle.
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

const _inventory = (state: MachineState) => state.context.state.inventory;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _game = (state: MachineState) => state.context.state;

export const Feed: React.FC<Props> = ({
  food,
  selectedName,
  setSelectedName,
  contentRef,
}) => {
  const [showBoosts, setShowBoosts] = useState(false);
  const [showBulkFeedModal, setShowBulkFeedModal] = useState(false);
  const [customFeedAmount, setCustomFeedAmount] = useState(new Decimal(0));
  const { gameService } = useContext(Context);
  const now = useNow({ live: true });
  const inventory = useSelector(gameService, _inventory);
  const bumpkin = useSelector(gameService, _bumpkin);
  const game = useSelector(gameService, _game);
  const { t } = useAppTranslation();
  // Derive the "active" selected food from the current props so that
  // we never point at a food item that is no longer available.
  const activeSelected =
    food.find((item) => item.name === selectedName) ?? food[0];

  const inventoryFoodCount = activeSelected
    ? (inventory[activeSelected.name] ?? new Decimal(0))
    : new Decimal(0);

  const isDrink = !!activeSelected && isJuice(activeSelected.name);
  const feedVerb = activeSelected ? (isDrink ? t("drink") : t("eat")) : "";
  const bulkFeedLabel = isDrink ? t("drinkInBulk") : t("eatInBulk");
  const eatAllLabel = isDrink ? t("drinkAll") : t("eatAll");

  const closeBulkFeedModal = () => {
    setShowBulkFeedModal(false);
    setCustomFeedAmount(new Decimal(0));
  };

  if (!activeSelected) {
    return (
      <InnerPanel>
        <div className="flex flex-col p-2">
          <Label type="warning">{t("statements.feed.bumpkin.one")}</Label>
          <span className="w-full my-2">
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
      </InnerPanel>
    );
  }

  // Reports level-up (and first-feed tutorial) milestones by diffing the
  // bumpkin's total level before and after a feed.
  const trackFeedMilestones = (
    send: () => ReturnType<typeof gameService.send>,
  ) => {
    const ascensionLevel = game.island.ascensionLevel ?? 0;
    const previousExperience = bumpkin?.experience ?? 0;
    // Track the total level (across ascension bands) so milestones still fire
    // correctly if a feed ever crosses an ascension boundary.
    let previousLevel: number = getTotalBumpkinLevel({
      experience: bumpkin.experience ?? 0,
      ascensionLevel,
    });

    const newState = send();

    const currentLevel = getTotalBumpkinLevel({
      experience: newState.context.state.bumpkin.experience ?? 0,
      ascensionLevel: newState.context.state.island.ascensionLevel ?? 0,
    });

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

  const feed = (amount: number) => {
    if (!activeSelected) return;

    trackFeedMilestones(() =>
      gameService.send("bumpkin.feed", {
        food: activeSelected.name,
        amount,
      }),
    );
  };

  const { boostedExp, boostsUsed } = getFoodExpBoost({
    food: activeSelected,
    game,
    createdAt: now,
  });

  return (
    <>
      <SplitScreenView
        divRef={contentRef}
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
              <div className="flex flex-col w-full space-y-1">
                <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                  {inventoryFoodCount.greaterThan(1) && (
                    <Button onClick={() => feed(1)}>{`${feedVerb} 1`}</Button>
                  )}
                  {inventoryFoodCount.greaterThan(0) && (
                    <Button
                      onClick={() =>
                        feed(
                          inventoryFoodCount.greaterThan(10)
                            ? 10
                            : inventoryFoodCount.toNumber(),
                        )
                      }
                    >
                      {`${feedVerb} ${
                        inventoryFoodCount.greaterThan(10)
                          ? 10
                          : inventoryFoodCount
                      }`}
                    </Button>
                  )}
                </div>
                {inventoryFoodCount.greaterThan(10) && (
                  <Button onClick={() => setShowBulkFeedModal(true)}>
                    {bulkFeedLabel}
                  </Button>
                )}
                {inventoryFoodCount.greaterThan(10) && (
                  <Button onClick={() => feed(inventoryFoodCount.toNumber())}>
                    {eatAllLabel}
                  </Button>
                )}
              </div>
            }
          />
        }
        content={
          <>
            {groupFoodByCategory(food).map(({ category, items }) => {
              return (
                <div key={category} className="flex flex-col w-full">
                  <div className="flex items-center ml-2 mb-1">
                    <Label type="default" icon={FOOD_CATEGORY_ICONS[category]}>
                      {t(FOOD_CATEGORY_LABEL_KEYS[category])}
                    </Label>
                  </div>
                  <div className="flex flex-wrap mb-2">
                    {items.map((item) => (
                      <Box
                        isSelected={activeSelected?.name === item.name}
                        key={item.name}
                        onClick={() => {
                          setSelectedName(item.name);
                          setShowBoosts(false);
                        }}
                        image={ITEM_DETAILS[item.name].image}
                        count={inventory[item.name]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        }
      />
      <BulkFeedModal
        show={showBulkFeedModal}
        onHide={closeBulkFeedModal}
        itemAmount={inventoryFoodCount}
        customAmount={customFeedAmount}
        setCustomAmount={setCustomFeedAmount}
        onCancel={closeBulkFeedModal}
        onFeed={() => {
          feed(customFeedAmount.toNumber());
          closeBulkFeedModal();
        }}
        xpAmount={boostedExp.mul(customFeedAmount)}
        feedLabel={feedVerb}
        bumpkinParts={bumpkin.equipped as Equipped}
      />
    </>
  );
};
