import React from "react";
import { ClaimReward } from "./ClaimReward";
import { useGame } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _referrals = (state: MachineState) => state.context.state.referrals;

export const ClaimReferralRewards: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  const referrals = useSelector(gameService, _referrals);
  const { rewards, totalUnclaimedReferrals = 0 } = referrals ?? {
    totalReferrals: 0,
  };

  if (!rewards) {
    return null;
  }

  return (
    <ClaimReward
      reward={{
        id: "referral-rewards",
        createdAt: 0,
        message: t("claimReferralRewards.description", {
          totalUnclaimedReferrals,
        }),
        items: rewards.items ?? {},
        wearables: rewards.wearables ?? {},
        sfl: rewards.sfl ?? 0,
        coins: rewards.coins ?? 0,
      }}
      onClaim={() => {
        gameService.send({ type: "referral.rewardsClaimed" });
        gameService.send({ type: "ACKNOWLEDGE" });
      }}
      label={t("claimReferralRewards.title")}
    />
  );
};
