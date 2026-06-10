import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import confetti from "canvas-confetti";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getObjectEntries } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import coinsIcon from "assets/icons/coins.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import vipIcon from "assets/icons/vip.webp";
import lockIcon from "assets/icons/lock.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  type ReferralReward,
  VIP_REFERRAL_MILESTONE_THRESHOLDS,
  VIP_REFERRAL_MILESTONES,
} from "features/game/lib/vipReferralMilestones";
import classNames from "classnames";

const _referrals = (state: MachineState) => state.context.state.referrals;

/**
 * Final, non-claimable perk shown at the bottom of the ladder: reaching this
 * many VIP referrals permanently raises the player's FLOWER commission to 20%.
 */
const FLOWER_COMMISSION_THRESHOLD = 100;

/**
 * Flatten a reward bucket into a list of prizes (icon + readable label) so each
 * one can be rendered as a Box next to its description (e.g. "5,000 Coins",
 * "1 Super Totem"). Order: coins, FLOWER, items, wearables.
 */
const getRewardPrizes = (
  reward: ReferralReward,
): { image: string; text: string }[] => {
  const prizes: { image: string; text: string }[] = [];

  if (reward.coins) {
    prizes.push({
      image: coinsIcon,
      text: `${reward.coins.toLocaleString()} ${
        reward.coins === 1 ? "Coin" : "Coins"
      }`,
    });
  }

  if (reward.sfl) {
    prizes.push({
      image: flowerIcon,
      text: `${reward.sfl.toLocaleString()} FLOWER`,
    });
  }

  getObjectEntries(reward.items ?? {}).forEach(([name, amount]) => {
    prizes.push({
      image: ITEM_DETAILS[name].image,
      text: `${(amount ?? 0).toLocaleString()} ${name}`,
    });
  });

  getObjectEntries(reward.wearables ?? {}).forEach(([name, amount]) => {
    prizes.push({
      image: getImageUrl(ITEM_IDS[name]),
      text: `${(amount ?? 0).toLocaleString()} ${name}`,
    });
  });

  return prizes;
};

export const VipReferralRewards: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService, showAnimations } = useContext(Context);
  const referrals = useSelector(gameService, _referrals);

  const totalVIPReferrals = referrals?.totalVIPReferrals ?? 0;
  const claimedMilestones = referrals?.vipMilestonesClaimed ?? {};
  const commissionReached = totalVIPReferrals >= FLOWER_COMMISSION_THRESHOLD;

  const handleClaim = (milestone: number) => {
    gameService.send("referral.vipMilestonesClaimed", { milestone });
    if (showAnimations) confetti();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap gap-1">
        <Label type="warning" icon={vipIcon}>
          {t("referral.vipRewards.title")}
        </Label>
        <Label type="vibrant" icon={vipIcon}>
          {t("referral.vipRewards.progress", {
            count: totalVIPReferrals,
            max: FLOWER_COMMISSION_THRESHOLD,
          })}
        </Label>
      </div>
      <p className="text-xs px-1">{t("referral.vipRewards.description")}</p>

      <div className="flex flex-col gap-1">
        {VIP_REFERRAL_MILESTONE_THRESHOLDS.map((threshold) => {
          const reward = VIP_REFERRAL_MILESTONES[threshold];
          const prizes = getRewardPrizes(reward);

          const isClaimed = claimedMilestones[threshold] !== undefined;
          const isReached = totalVIPReferrals >= threshold;
          const canClaim = isReached && !isClaimed;

          return (
            <InnerPanel
              key={threshold}
              className={classNames(
                "flex items-center gap-2 !p-1 transition-opacity",
                {
                  "opacity-60": isClaimed,
                },
              )}
            >
              {/* VIP referral threshold badge */}
              <div className="flex flex-col items-center justify-center w-10 shrink-0">
                <img src={vipIcon} className="w-5 mb-0.5" alt="VIP" />
                <span className="text-xs leading-none">{threshold}</span>
              </div>

              {/* Reward prizes */}
              <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                {prizes.map((prize, index) => (
                  <div
                    key={`${threshold}-${index}`}
                    className="flex items-center"
                  >
                    <Box
                      image={prize.image}
                      hideCount
                      className="scale-[0.8] -m-1"
                    />
                    <span className="text-xs ml-1">{prize.text}</span>
                  </div>
                ))}
              </div>

              {/* Status / claim action */}
              <div className="w-[68px] shrink-0 flex justify-end items-center">
                {isClaimed && (
                  <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                    {t("claimed")}
                  </Label>
                )}
                {canClaim && (
                  <Button
                    className="text-xs w-fit px-3 py-1"
                    onClick={() => handleClaim(threshold)}
                  >
                    {t("claim")}
                  </Button>
                )}
                {!isReached && (
                  <Label type="default" icon={lockIcon}>
                    {`${totalVIPReferrals}/${threshold}`}
                  </Label>
                )}
              </div>
            </InnerPanel>
          );
        })}

        {/* Final perk — automatic, never claimable. Styled identically to the
            milestones above (lock icon + progress until 100 VIP referrals). */}
        <InnerPanel className="flex items-center gap-2 !p-1">
          {/* VIP referral threshold badge */}
          <div className="flex flex-col items-center justify-center w-10 shrink-0">
            <img src={vipIcon} className="w-5 mb-0.5" alt="VIP" />
            <span className="text-xs leading-none">
              {FLOWER_COMMISSION_THRESHOLD}
            </span>
          </div>

          {/* Perk */}
          <div className="flex flex-col flex-1 min-w-0 gap-0.5">
            <div className="flex items-center">
              <Box image={flowerIcon} hideCount className="scale-[0.8] -m-1" />
              <span className="text-xs ml-1">
                {t("referral.vipRewards.commission")}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="w-[68px] shrink-0 flex justify-end items-center">
            {commissionReached ? (
              <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                {t("completed")}
              </Label>
            ) : (
              <Label type="default" icon={lockIcon}>
                {`${totalVIPReferrals}/${FLOWER_COMMISSION_THRESHOLD}`}
              </Label>
            )}
          </div>
        </InnerPanel>
      </div>
    </div>
  );
};
