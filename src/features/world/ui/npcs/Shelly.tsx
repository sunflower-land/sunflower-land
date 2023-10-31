import React, { useContext, useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";

import { DeliveryPanel } from "../deliveries/DeliveryPanel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const KrakenIntro: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <SpeakingModal
      key="kraken"
      onClose={() => {
        onClose();
      }}
      bumpkinParts={NPC_WEARABLES.shelly}
      message={[
        {
          text: "The Kraken's appetite is constantly changing.",
        },
        {
          text: `Right now it has a hunger for ${state.catchTheKraken.hunger}....Phew, that's better than Bumpkins.`,
        },
        {
          text: "Head to your fishing spot and try catch the beast!",
          actions: [
            {
              text: "Got it!",
              cb: () => onClose(),
            },
          ],
        },
      ]}
    />
  );
};
interface Props {
  onClose: () => void;
}
export const Shelly: React.FC<Props> = ({ onClose }) => {
  const [showBeachIntro, setShowBeachIntro] = useState(
    !isNPCAcknowledged("shelly")
  );
  const [showKrakenIntro, setShowKrakenIntro] = useState(
    isNPCAcknowledged("shelly")
  );

  useEffect(() => {
    acknowledgeNPC("shelly");
  }, []);

  if (showBeachIntro) {
    return (
      <SpeakingModal
        key="feathers"
        onClose={() => {
          onClose();
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
                cb: () => setShowBeachIntro(false),
              },
            ],
          },
        ]}
      />
    );
  }

  if (showKrakenIntro) {
    return <KrakenIntro onClose={() => setShowKrakenIntro(false)} />;
  }

  return <DeliveryPanel npc="shelly" onClose={onClose} />;
};
