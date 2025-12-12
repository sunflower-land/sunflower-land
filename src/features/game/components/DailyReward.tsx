import { Button } from "components/ui/Button";
import { Label, LabelType } from "components/ui/Label";
import React, { useMemo, useState } from "react";
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

import basicFarmerBox from "assets/rewardBoxes/basic_farmer_box.webp";
import { BuffName } from "../types/buffs";

export const DAILY_REWARD_IMAGES: Record<DailyRewardName, string> = {
  "default-reward": basicFarmerBox,
  "onboarding-day-1-sprout-starter": basicFarmerBox,
  "onboarding-day-2-builder-basics": basicFarmerBox,
  "onboarding-day-3-harvesters-gift": basicFarmerBox,
  "onboarding-day-4-tool-tune-up": basicFarmerBox,
  "onboarding-day-5-bumpkin-gift": basicFarmerBox,
  "onboarding-day-6-anchovy-kit": basicFarmerBox,
  "onboarding-day-7-first-week-finale": basicFarmerBox,
  "weekly-day-1-tool-cache": basicFarmerBox,
  "weekly-day-2-growth-feast": basicFarmerBox,
  "weekly-day-3-love-box": basicFarmerBox,
  "weekly-day-4-angler-pack": basicFarmerBox,
  "weekly-day-5-growth-boost": basicFarmerBox,
  "weekly-day-6-coin-stash": basicFarmerBox,
  "weekly-mega-box": basicFarmerBox,
  "streak-one-year": basicFarmerBox,
  "streak-two-year": basicFarmerBox,
};

const _bumpkinExperience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;
const _dailyRewards = (state: MachineState) => state.context.state.dailyRewards;
const _gameState = (state: MachineState) => state.context.state;

function acknowledgeDailyReward() {
  localStorage.setItem("dailyRewardAcknowledged", new Date().toISOString());
}

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

  const hasClaimed = !isDailyRewardReady({
    dailyRewards,
    bumpkinExperience,
    now,
  });

  const rewards = useMemo(() => {
    let streak = getDailyRewardStreak({
      game: gameState,
      dailyRewards,
      currentDate,
    });

    if (hasClaimed) {
      streak -= 1;
    }

    return new Array(7).fill(null).map((_, index) => {
      return {
        day: streak + index + 1,
        reward: getRewardsForStreak({
          game: gameState,
          streak: streak + index,
          currentDate,
        }),
      };
    });
  }, [dailyRewards, hasClaimed, currentDate, gameState]);

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
          gameService.send("dailyReward.claimed");
          gameService.send("CONTINUE");
          setShowClaim(false);
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
            gameService.send("CONTINUE");
          }}
        />
      )}
      <Label type="warning">{t("dailyReward.title")}</Label>
      <p className="text-xs mx-1 my-2">
        {t("dailyReward.megaRewardCountdown", {
          days: daysTillWeeklyMega,
        })}
      </p>
      <div className="flex overflow-x-scroll  px-1 mb-1">
        {rewards.map(({ day, reward }, index) => {
          const items = reward.reduce((acc, reward) => {
            return [...acc, ...getKeys(reward.items ?? {})];
          }, [] as InventoryItemName[]);

          const coins = reward.reduce((acc, reward) => {
            return acc + (reward.coins ?? 0);
          }, 0);

          let labelType: LabelType = "default";

          if (index === 0) {
            labelType = "info";
          }

          if (day % 7 === 0) {
            labelType = "vibrant";
          }

          let labelText = t("dailyReward.day", { day });

          if (index === 0) {
            labelText = t("dailyReward.today");
          }

          if (hasClaimed && index === 0) {
            labelType = "success";
            labelText = t("dailyReward.claimed");
          }

          console.log({ COINS: coins });

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
                  {reward
                    .filter((reward) => reward.id !== "default-reward")
                    .map((reward) => {
                      return (
                        <>
                          <img
                            src={DAILY_REWARD_IMAGES[reward.id]}
                            className="h-16"
                          />
                          <Label type="default" className="mb-1">
                            {reward.id}
                          </Label>
                        </>
                      );
                    })}
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
        >
          {t("dailyReward.claim")}
        </Button>
      )}
    </div>
  );
};
