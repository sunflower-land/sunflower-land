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
import { getRewardsForStreak } from "../types/dailyRewards";
import { InventoryItemName } from "../types/game";
import { getKeys } from "../lib/crafting";
import { ClaimReward } from "../expansion/components/ClaimReward";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";

const _bumpkinExperience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;
const _dailyRewards = (state: MachineState) => state.context.state.dailyRewards;

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

  const now = useNow({ live: true });
  const currentDate = new Date(now).toISOString().substring(0, 10);

  const [showClaim, setShowClaim] = useState(false);

  const hasClaimed = !isDailyRewardReady({
    dailyRewards,
    bumpkinExperience,
    now,
  });

  const rewards = useMemo(() => {
    let streak = getDailyRewardStreak({ dailyRewards, currentDate });

    if (hasClaimed) {
      streak -= 1;
    }

    return new Array(7).fill(null).map((_, index) => {
      return {
        day: streak + index + 1,
        reward: getRewardsForStreak({
          streak: streak + index,
          currentDate,
        }),
      };
    });
  }, [dailyRewards, hasClaimed, currentDate]);

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

    return (
      <ClaimReward
        reward={{
          items,
          wearables: {},
          coins,
          sfl: 0,
          id: "daily-reward",
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

          let labelType: LabelType = "default";

          if (index === 0) {
            labelType = "info";
          } else if (day % 7 === 0) {
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
                  <img src={ITEM_DETAILS[items[0]].image} className="h-16" />
                </div>
                <div className="absolute -bottom-1 -left-4 -right-4  flex justify-between items-end">
                  {items.slice(1).map((item, index) => {
                    return (
                      <img
                        key={`${index}`}
                        src={ITEM_DETAILS[item].image}
                        className="w-8 "
                      />
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
