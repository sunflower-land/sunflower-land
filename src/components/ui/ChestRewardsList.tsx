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
  BASIC_CHAPTER_REWARDS_WEIGHT,
  CHAPTER_REWARDS,
} from "features/game/types/chests";
import {
  NoticeboardItems,
  NoticeboardItemsElements,
} from "features/world/ui/kingdom/KingdomNoticeboard";
import { getCurrentChapter } from "features/game/types/chapters";
import chestIcon from "assets/icons/chest.png";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";

import { Box } from "./Box";
import Decimal from "decimal.js-light";
import { getImageUrl } from "lib/utils/getImageURLS";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import {
  REWARD_BOXES,
  RewardBoxName,
  RewardBoxReward,
} from "features/game/types/rewardBoxes";
import { useNow } from "lib/utils/hooks/useNow";

const RewardRow: React.FC<{
  rewardName: string;
  amount: number;
  chance?: string;
  icon?: string;
  secondBG?: boolean;
}> = ({ rewardName, amount, chance, icon, secondBG }) => {
  return (
    <div
      className={`flex justify-between items-center pr-2 ${secondBG ? "bg-[#ead4aa] rounded" : "bg-[#c285697d] rounded"}`}
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
  return CHAPTER_REWARDS(BASIC_CHAPTER_REWARDS_WEIGHT, "luxury").some(
    (reward) =>
      (reward.items && Object.keys(reward.items).includes(rewardName)) ||
      (reward.wearables && Object.keys(reward.wearables).includes(rewardName)),
  );
};

const MultipleRewardsRow: React.FC<{
  reward: RewardBoxReward;
  chance?: string;
  secondBG?: boolean;
}> = ({ reward, chance, secondBG }) => {
  const { t } = useAppTranslation();
  const now = useNow();
  const currentChapter = getCurrentChapter(now);
  const rewards = reward.wearables
    ? Object.entries(reward.wearables)
    : reward.items
      ? Object.entries(reward.items)
      : [];

  return (
    <div
      className={`flex justify-between items-center pr-2 ${secondBG ? "bg-[#ead4aa] rounded" : "bg-[#c285697d] rounded"}`}
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
                      ? t("wearable")
                      : isPlaceable
                        ? t("collectible")
                        : ""}
                  </p>
                </div>
              </div>

              {/* States whether it is chapter-limited */}
              {isStoreChapterItem(rewardName) && (
                <div className="flex items-center w-20 sm:w-40 space-x-1 pl-[15%]">
                  <img src={SUNNYSIDE.icons.stopwatch} />
                  <p className="text-xxs">{`${currentChapter}`}</p>
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
  type: ChestRewardType | RewardBoxName;
  listTitle?: string;
  isFirstInMultiList?: boolean;
  isSubsequentInMultiList?: boolean;
  chestDescription?: NoticeboardItemsElements[];
}> = ({
  type,
  listTitle,
  isFirstInMultiList,
  isSubsequentInMultiList,
  chestDescription,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const state = useSelector(gameService, (state) => state.context.state);

  const isChestRewardType = (
    type: ChestRewardType | RewardBoxName,
  ): type is ChestRewardType => type in CHEST_LOOT(state);

  const rewards: RewardBoxReward[] = isChestRewardType(type)
    ? CHEST_LOOT(state)[type]
    : REWARD_BOXES[type].rewards;

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
            items={
              chestDescription ?? [
                {
                  text: t("chestRewardsList.otherChests.desc1"),
                  icon: chestIcon,
                },
                {
                  text: t("chestRewardsList.otherChests.desc2"),
                  icon: ITEM_DETAILS["Shroom Syrup"].image,
                },
              ]
            }
          />
        </div>
      )}
      <div className="flex justify-between my-2 ml-0">
        <Label type="default">
          {listTitle ?? t("chestRewardsList.listTitle1")}
        </Label>
        {!isSubsequentInMultiList && (
          <Label type="default">{t("chestRewardsList.listTitle2")}</Label>
        )}
      </div>
      {...rewards
        .sort((a, b) => b.weighting - a.weighting) // Sort by weighting descending
        .map((reward, index) => {
          return (
            <div key={index}>
              {(reward.coins ?? 0 > 0) && (
                <RewardRow
                  rewardName={t("coins")}
                  amount={reward.coins ?? 0}
                  chance={`${rewardChance(reward.weighting)}%`}
                  icon={SUNNYSIDE.ui.coins}
                  secondBG={index % 2 === 0}
                />
              )}

              {(reward.items || reward.wearables) && (
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
