import React, { useContext, useState } from "react";
import confetti from "canvas-confetti";

import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}

export const NyeButton: React.FC<Props> = ({ onClose }) => {
  const [showReward, setShowReward] = useState(false);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const hasClaimed = !!gameState.context.state.wardrobe?.["New Years Tiara"];

  if (showReward) {
    return (
      <CloseButtonPanel>
        <ClaimReward
          reward={{
            createdAt: Date.now(),
            id: "2023-nye-reward",
            items: {},
            wearables: {
              "New Years Tiara": 1,
            },
            sfl: 0,
          }}
          onClaim={() => {
            gameService.send("bonus.claimed", {
              name: "2024-nye-bonus",
            });
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
          text: "A magical button has appeared in the plaza. Do you want to press it?",
          actions: [
            {
              text: "No",
              cb: onClose,
            },
            {
              text: "Yes",
              cb: () => {
                console.log("Pressed");
                confetti();

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
