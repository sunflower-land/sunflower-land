import { Button } from "components/ui/Button";
import { Label, LabelType } from "components/ui/Label";
import React, { useState } from "react";
import { useGame } from "../GameProvider";
import { ButtonPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "../types/images";
import {
  getDailyRewardStreak,
  isDailyRewardReady,
} from "../events/landExpansion/claimDailyReward";
import { DailyRewardName, getRewardsForStreak } from "../types/dailyRewards";
import { InventoryItemName } from "../types/game";
import { getKeys } from "../lib/crafting";
import { ClaimReward } from "../expansion/components/ClaimReward";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";
import { gameAnalytics } from "lib/gameAnalytics";

import basicToolBox from "assets/rewardBoxes/basic_tool_box.png";
import streakBox from "assets/rewardBoxes/streak_box.png";
import basicResourceBox from "assets/rewardBoxes/basic_resource_box.png";
import basicFishingBox from "assets/rewardBoxes/basic_fishing_box.png";
import basicBuffBox from "assets/rewardBoxes/basic_buff_box.png";
import basicXPBox from "assets/rewardBoxes/basic_xp_box.png";
import { BuffName } from "../types/buffs";
import coinsIcon from "assets/icons/coins_stack.webp";
import { getBumpkinLevel } from "../lib/level";

export const DAILY_REWARD_IMAGES: Record<DailyRewardName, string> = {
  "default-reward": SUNNYSIDE.icons.expression_confused,
  "onboarding-day-1-sprout-starter": ITEM_DETAILS["Basic Farming Pack"].image,
  "onboarding-day-2-builder-basics": basicResourceBox,
  "onboarding-day-3-harvesters-gift": ITEM_DETAILS["Basic Love Box"].image,
  "onboarding-day-4-tool-tune-up": basicToolBox,
  "onboarding-day-5-bumpkin-gift": coinsIcon,
  "onboarding-day-6-anchovy-kit": basicFishingBox,
  "onboarding-day-7-first-week-finale": ITEM_DETAILS["Weekly Mega Box"].image,
  "weekly-day-1-tool-cache": basicToolBox,
  "weekly-day-2-growth-boost": basicBuffBox,
  "weekly-day-3-love-box": ITEM_DETAILS["Basic Love Box"].image,
  "weekly-day-4-angler-pack": basicFishingBox,
  "weekly-day-5-growth-feast": basicXPBox,
  "weekly-day-6-coin-stash": coinsIcon,
  "weekly-mega-box": ITEM_DETAILS["Weekly Mega Box"].image,
  "streak-one-year": streakBox,
  "streak-two-year": streakBox,
};

const _bumpkinExperience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;
const _dailyRewards = (state: MachineState) => state.context.state.dailyRewards;
const _gameState = (state: MachineState) => state.context.state;

function acknowledgeDailyReward() {
  localStorage.setItem("dailyRewardAcknowledged", new Date().toISOString());
}

const getUtcDay = (value: number) => {
  const date = new Date(value);

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const getUtcDayDifference = (later: number, earlier: number) => {
  const difference = getUtcDay(later) - getUtcDay(earlier);

  return Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
};

export function getDailyRewardLastAcknowledged(): Date | null {
  const value = localStorage.getItem("dailyRewardAcknowledged");
  if (!value) return null;
  return new Date(value as string);
}

export const DailyRewardClaim: React.FC<{ showClose?: boolean }> = ({
  showClose,
}) => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();

  const bumpkinExperience = useSelector(gameService, _bumpkinExperience);
  const dailyRewards = useSelector(gameService, _dailyRewards);
  const gameState = useSelector(gameService, _gameState);

  const now = useNow({ live: true });
  const currentDate = new Date(now).toISOString().substring(0, 10);

  const [showClaim, setShowClaim] = useState(false);
  const hasUnlocked = getBumpkinLevel(bumpkinExperience) >= 3;

  const claim = () => {
    const lastCollectedAt =
      dailyRewards?.chest?.collectedAt ?? gameState.createdAt ?? now;

    gameService.send({ type: "dailyReward.claimed" });
    gameService.send({ type: "CONTINUE" });

    if (gameState.createdAt > new Date("2026-01-09").getTime()) {
      const daysSinceLastClaim = getUtcDayDifference(now, lastCollectedAt);
      const totalClaimed =
        gameService.getSnapshot().context.state.farmActivity[
          "Daily Reward Collected"
        ] ?? 0;

      gameAnalytics.trackDailyRewardReturn({
        totalClaimed,
        daysSinceLastClaim,
      });
    }

    setShowClaim(false);
  };

  const hasClaimed =
    !isDailyRewardReady({
      dailyRewards,
      bumpkinExperience,
      now,
    }) && hasUnlocked;

  let streak = getDailyRewardStreak({
    game: gameState,
    dailyRewards,
    currentDate,
  });

  if (hasClaimed) {
    streak -= 1;
  }

  if (streak < 0) {
    streak = 0;
  }

  const rewards = new Array(7).fill(null).map((_, index) => {
    return {
      day: streak + index + 1,
      reward: getRewardsForStreak({
        game: gameState,
        streak: streak + index,
        currentDate,
        now,
      }).rewards,
    };
  });

  if (showClaim) {
    const items = rewards[0].reward.reduce(
      (acc, reward) => {
        return getKeys(reward.items ?? {}).reduce((acc, item) => {
          return {
            ...acc,
            [item]: (acc[item] ?? 0) + (reward.items?.[item] ?? 0),
          };
        }, acc);
      },
      {} as Partial<Record<InventoryItemName, number>>,
    );

    const coins = rewards[0].reward.reduce((acc, reward) => {
      return acc + (reward.coins ?? 0);
    }, 0);

    const xp = rewards[0].reward.reduce((acc, reward) => {
      return acc + (reward.xp ?? 0);
    }, 0);

    const buffs = rewards[0].reward.reduce((acc, reward) => {
      if (reward.buff) {
        return [...acc, reward.buff];
      }
      return acc;
    }, [] as BuffName[]);

    return (
      <ClaimReward
        reward={{
          items,
          wearables: {},
          coins,
          sfl: 0,
          id: "daily-reward",
          xp,
          buff: buffs[0],
        }}
        onClaim={() => {
          claim();
        }}
      />
    );
  }

  const daysTillWeeklyMega = 7 - (rewards[0].day % 7);
  const timeLeft = secondsToString(secondsTillReset(now), { length: "full" });

  return (
    <div className="relative">
      {showClose && (
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute top-0 right-0 w-8 cursor-pointer"
          onClick={() => {
            acknowledgeDailyReward();
            gameService.send({ type: "CONTINUE" });
          }}
        />
      )}
      <div className="flex flex-row items-center gap-1">
        <Label type="warning">{t("dailyReward.title")}</Label>
        {!hasUnlocked && (
          <Label type="formula" secondaryIcon={SUNNYSIDE.icons.lock}>
            {`Unlock at level 3`}
          </Label>
        )}
      </div>
      <p className="text-xs mx-1 my-2">
        {t("dailyReward.megaRewardCountdown", {
          days: daysTillWeeklyMega,
        })}
      </p>
      <div className="flex overflow-x-scroll scrollable px-1 mb-1">
        {rewards.map(({ day, reward }, index) => {
          let labelType: LabelType = "default";

          if (day % 7 === 0) {
            labelType = "vibrant";
          }

          let labelText = t("dailyReward.day", { day });

          if (index === 0 && hasUnlocked) {
            labelType = "info";
            labelText = t("dailyReward.today");
          }

          if (hasClaimed && index === 0) {
            labelType = "success";
            labelText = t("dailyReward.claimed");
          }

          const boxes = reward.filter(
            (reward) => reward.id !== "default-reward",
          );

          return (
            <ButtonPanel
              key={`${day}`}
              variant={index === 0 ? "primary" : "secondary"}
              className="w-32 min-w-32 flex flex-col items-center mr-1"
            >
              <Label type={labelType} className="mb-1">
                {labelText}
              </Label>
              <div className="relative mb-1">
                <div className="w-16 flex items-center justify-center">
                  <img
                    src={DAILY_REWARD_IMAGES[boxes[boxes.length - 1].id]}
                    className="h-16"
                  />
                </div>
              </div>
            </ButtonPanel>
          );
        })}
      </div>
      {hasClaimed ? (
        <div className="pb-2 space-y-2">
          <span className="text-xs m-1">{t("dailyReward.returnTomorrow")}</span>
          <Label
            type="transparent"
            className="ml-3 mt-1"
            icon={SUNNYSIDE.icons.stopwatch}
          >
            {t("dailyReward.timeLeft", { time: timeLeft })}
          </Label>
        </div>
      ) : (
        <Button
          onClick={() => {
            setShowClaim(true);
          }}
          disabled={!hasUnlocked}
        >
          {t("dailyReward.claim")}
        </Button>
      )}
    </div>
  );
};
