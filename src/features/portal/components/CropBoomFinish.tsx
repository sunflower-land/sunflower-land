import { ClaimReward } from "features/game/expansion/components/Airdrop";
import React from "react";

export const CropBoomFinish: React.FC = () => {
  return (
    <ClaimReward
      onClaim={() => {
        // TODO
      }}
      reward={{
        id: "x",
        createdAt: 0,
        items: { "Community Coin": 1 },
        wearables: {},
        sfl: 0,
      }}
    />
  );
};
