import React, { useContext, useState } from "react";
import confetti from "canvas-confetti";

import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useActor } from "@xstate/react";
import { translate } from "lib/i18n/translate";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  onClose: () => void;
}

export const NyeButton: React.FC<Props> = ({ onClose }) => {
  const [showReward, setShowReward] = useState(false);

  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const now = useNow();

  const hasClaimed = !!gameState.context.state.wardrobe?.["New Years Tiara"];

  if (showReward) {
    return (
      <CloseButtonPanel>
        <ClaimReward
          reward={{
            createdAt: now,
            id: "2023-nye-reward",
            items: {},
            wearables: {
              "New Years Tiara": 1,
            },
            sfl: 0,
            coins: 0,
          }}
          onClaim={() => {
            gameService.send({ type: "bonus.claimed", name: "2024-nye-bonus" });
            onClose();
          }}
        />
      </CloseButtonPanel>
    );
  }

  return (
    <SpeakingModal
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
      message={[
        {
          text: translate("plaza.magicButton.query"),
          actions: [
            {
              text: translate("no"),
              cb: onClose,
            },
            {
              text: translate("yes"),
              cb: () => {
                if (showAnimations) confetti();

                if (hasClaimed) {
                  onClose();
                } else {
                  setShowReward(true);
                }
              },
            },
          ],
        },
      ]}
    />
  );
};
