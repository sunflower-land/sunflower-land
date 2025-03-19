import React from "react";
import { ClaimReward } from "./ClaimReward";
import { useGame } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

const _referrals = (state: MachineState) => state.context.state.referrals;

export const ClaimReferralRewards: React.FC = () => {
  const { gameService } = useGame();
  const referrals = useSelector(gameService, _referrals);
  const { rewards = {}, totalUnclaimedReferrals = 0 } = referrals ?? {
    totalReferrals: 0,
  };

  return (
    <ClaimReward
      reward={{
        id: "referral-rewards",
        createdAt: 0,
        message: `You have ${totalUnclaimedReferrals} unclaimed referrals! Thanks for referring these new players`,
        items: rewards.items ?? {},
        wearables: rewards.wearables ?? {},
        sfl: rewards.sfl ?? 0,
        coins: rewards.coins ?? 0,
      }}
      onClaim={() => {
        gameService.send("referral.rewardsClaimed");
        gameService.send("ACKNOWLEDGE");
      }}
    />
  );
};
