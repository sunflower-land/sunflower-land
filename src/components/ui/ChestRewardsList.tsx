import React, { useContext } from "react";
import {
  CHEST_LOOT,
  ChestRewardType,
} from "features/world/ui/chests/ChestRevealing";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import { Label } from "./Label";
import {
  BASIC_SEASONAL_REWARDS_WEIGHT,
  ChestReward,
  SEASONAL_REWARDS,
} from "features/game/types/chests";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import {
  getCurrentSeason,
  getSeasonalArtefact,
} from "features/game/types/seasons";
import chestIcon from "assets/icons/chest.png";
import bonusReward from "assets/icons/gift.png";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";

import { Box } from "./Box";
import Decimal from "decimal.js-light";
import { getImageUrl } from "lib/utils/getImageURLS";

const RewardRow: React.FC<{
  rewardName: string;
  amount: number;
  chance?: string;
  icon?: string;
  secondBG?: boolean;
}> = ({ rewardName, amount, chance, icon, secondBG }) => {
  return (
    <div
      className={`flex justify-between items-center p-1 pr-2 ${secondBG ? "bg-[#ead4aa] rounded" : "bg-[#c285697d] rounded"}`}
    >
      <div className="flex items-center w-32 sm:w-40">
        <Box
          image={icon}
          count={new Decimal(amount)}
          className="scale-[0.85] -m-0.5"
        />
        <p className="ml-1">{rewardName}</p>
      </div>
      <p>{chance}</p>
    </div>
  );
};

const isStoreChapterItem = (rewardName: string) => {
  return SEASONAL_REWARDS(BASIC_SEASONAL_REWARDS_WEIGHT).some(
    (reward) =>
      (reward.items && Object.keys(reward.items).includes(rewardName)) ||
      (reward.wearables && Object.keys(reward.wearables).includes(rewardName)),
  );
};
const MultipleRewardsRow: React.FC<{
  reward: ChestReward;
  chance?: string;
  secondBG?: boolean;
}> = ({ reward, chance, secondBG }) => {
  const rewards = reward.wearables
    ? Object.entries(reward.wearables)
    : reward.items
      ? Object.entries(reward.items)
      : [];

  return (
    <div
      className={`flex justify-between items-center p-1 pr-2 ${secondBG ? "bg-[#ead4aa] rounded" : "bg-[#c285697d] rounded"}`}
    >
      <div className={`flex flex-col justify-between items-start `}>
        {rewards.map(([rewardName, amount], itemIndex) => {
          const itemDetails = ITEM_DETAILS[rewardName as InventoryItemName];
          const wearableID = ITEM_IDS[rewardName as BumpkinItem];
          const isPlaceable = Object.keys(COLLECTIBLES_DIMENSIONS).includes(
            rewardName,
          );

          const imageSrc =
            (reward.wearables ? getImageUrl(wearableID) : itemDetails?.image) ??
            SUNNYSIDE.icons.expression_confused;

          return (
            <div className="flex justify-between items-center" key={itemIndex}>
              <div className="flex items-center w-32 sm:w-40">
                <Box
                  image={imageSrc}
                  count={new Decimal(amount)}
                  className={`scale-[0.85] -m-0.5 ${itemIndex > 0 && "-mt-2"}`}
                  iconClassName={reward.wearables ? "scale-[1.1]" : ""}
                />
                <div className="flex-1 ml-1">
                  <p>{rewardName}</p>
                  <p className="text-[#862935] text-xxs mt-0.5">
                    {reward.wearables
                      ? "Wearable"
                      : isPlaceable
                        ? "Collectible"
                        : ""}
                  </p>
                </div>
              </div>

              {/* States whether it is chapter-limited */}
              {isStoreChapterItem(rewardName) && (
                <div className="flex items-center w-20 sm:w-40 space-x-1 pl-[15%]">
                  <img src={SUNNYSIDE.icons.stopwatch} />
                  <p className="text-xxs">{`${getCurrentSeason()}`}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p>{`${chance}`}</p>
    </div>
  );
};

export const ChestRewardsList: React.FC<{
  type: ChestRewardType;
  listTitle?: string;
  isFirstInMultiList?: boolean;
  isSubsequentInMultiList?: boolean;
}> = ({ type, listTitle, isFirstInMultiList, isSubsequentInMultiList }) => {
  const { gameService } = useContext(Context);

  const rewards = CHEST_LOOT(gameService.getSnapshot().context.state)[type];

  // Based on total weighting for each list
  const rewardChance = (weigthing: number) => {
    const totalWeigthing = rewards.reduce(
      (acc, curr) => acc + curr.weighting,
      0,
    );
    const rewardChance = formatNumber(
      Math.ceil((weigthing / totalWeigthing) * 10000) / 100,
    );

    return rewardChance;
  };

  return (
    <div
      className={`flex flex-col py-0.5 pr-1 text-xs ${isFirstInMultiList || isSubsequentInMultiList ? "" : "overflow-y-auto max-h-[400px] scrollable"}`}
    >
      {/* The condition hides the descriptions in subsequent lists */}
      {!isSubsequentInMultiList && (
        <div className="py-1.5">
          <NoticeboardItems
            items={[
              ...(type === "Basic Desert Rewards"
                ? [
                    {
                      text: `Increase your Desert Daily Streak to earn rewards from higher tiers.`,
                      icon: ITEM_DETAILS["Sand Drill"].image,
                    },
                    {
                      text: `Claiming the reward grants one chapter artefact.`,
                      icon: ITEM_DETAILS[getSeasonalArtefact()].image,
                    },
                  ]
                : [
                    ...(type === "Basic Daily Rewards"
                      ? [
                          {
                            text: `Unlock more expansions on the first island to receive rewards from higher tiers.`,
                            icon: SUNNYSIDE.icons.hammer,
                          },
                          {
                            text: `Earn a bonus reward for each 365-day streak.`,
                            icon: bonusReward,
                          },
                        ]
                      : [
                          {
                            text: `Open the chest for a chance to receive one of the following rewards.`,
                            icon: chestIcon,
                          },
                          {
                            text: `Some rewards are exclusive to specific chest types.`,
                            icon: ITEM_DETAILS["Shroom Syrup"].image,
                          },
                        ]),
                  ]),
            ]}
          />
        </div>
      )}
      <div className="flex justify-between my-2 ml-0">
        <Label type="default">{listTitle ?? `Reward`}</Label>
        {!isSubsequentInMultiList && <Label type="default">{`Chance`}</Label>}
      </div>
      {...rewards
        .sort((a, b) => b.weighting - a.weighting) // Sort by weighting descending
        .map((reward, index) => {
          return (
            <div key={index}>
              {(reward.coins ?? 0 > 0) && (
                <RewardRow
                  rewardName="Coins"
                  amount={reward.coins ?? 0}
                  chance={`${rewardChance(reward.weighting)}%`}
                  icon={SUNNYSIDE.ui.coins}
                  secondBG={index % 2 === 0}
                />
              )}

              {!!reward.items && (
                <MultipleRewardsRow
                  reward={reward}
                  chance={`${rewardChance(reward.weighting)}%`}
                  secondBG={index % 2 === 0}
                />
              )}

              {!!reward.wearables && (
                <MultipleRewardsRow
                  reward={reward}
                  chance={`${rewardChance(reward.weighting)}%`}
                  secondBG={index % 2 === 0}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};
