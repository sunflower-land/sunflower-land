import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { ClaimReward } from "./ClaimReward";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { BONUSES } from "features/game/types/bonuses";
import { useTranslation } from "react-i18next";

/**
 * Display airdrops that have no coordinates
 */
export const FontReward: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const [showReward, setShowReward] = useState(false);

  const { t } = useTranslation();

  const claim = () => {
    const state = gameService.send("bonus.claimed", {
      name: "pixel-font-bonus",
    });
    gameService.send("ACKNOWLEDGE");
  };

  if (showReward) {
    return (
      <Panel
        bumpkinParts={{
          ...NPC_WEARABLES["pumpkin' pete"],
          shirt: "Pixel Perfect Hoodie",
        }}
      >
        <ClaimReward
          reward={{
            wearables: BONUSES["pixel-font-bonus"].reward.wearables,
            items: {},
            coins: 0,
            createdAt: Date.now(),
            sfl: 0,
            id: "pixel-font-bonus",
            message: t("fontReward.bonus.claim"),
          }}
          onClaim={claim}
        />
      </Panel>
    );
  }

  return (
    <SpeakingModal
      message={[
        {
          text: t("fontReward.bonus.intro1"),
        },
        {
          text: t("fontReward.bonus.intro2"),
        },
        {
          text: t("fontReward.bonus.intro3"),
        },
      ]}
      onClose={() => setShowReward(true)}
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
    />
  );
};
