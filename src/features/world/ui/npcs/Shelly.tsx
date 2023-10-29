import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";

import { DeliveryPanel } from "../deliveries/DeliveryPanel";

interface Props {
  onClose: () => void;
}
export const Shelly: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(!isNPCAcknowledged("shelly"));

  useEffect(() => {
    acknowledgeNPC("shelly");
  }, []);

  if (showIntro) {
    return (
      <SpeakingModal
        key="feathers"
        onClose={() => {
          setShowIntro(false);
        }}
        bumpkinParts={NPC_WEARABLES.shelly}
        message={[
          {
            text: "Howdy, Bumpkin! Welcome to the beach!",
          },
          {
            text: "After a hard day's work on your farm, there's no better place to kick back and enjoy the waves.",
          },
          {
            text: "But we've got a bit of a situation. A massive kraken has emerged and taken control of our beloved beach.",
          },
          {
            text: "We could really use your help, dear. Grab your bait and fishing rods, and together, we'll tackle this colossal problem!",
          },
          {
            text: "For each tentacle you catch I will provide you with valuable mermaid scales!",
            actions: [
              {
                text: "Let's do it!",
                cb: () => setShowIntro(false),
              },
            ],
          },
        ]}
      />
    );
  }

  return <DeliveryPanel npc="shelly" onClose={onClose} />;
};
