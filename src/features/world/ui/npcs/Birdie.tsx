import React, { useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";

interface Props {
  onClose: () => void;
}
export const Birdie: React.FC<Props> = ({ onClose }) => {
  const [showFeatherHelp, setShowFeatherHelp] = useState(false);
  const [showSeasonHelp, setShowSeasonHelp] = useState(false);

  useEffect(() => {
    acknowledgeNPC("birdie");
  }, []);

  if (showFeatherHelp) {
    return (
      <SpeakingModal
        key="feathers"
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.birdie}
        message={[
          {
            text: "You can earn Crow Feathers in a variety of ways.",
          },
          {
            text: "The most common method to earn Crow Feathers is by gathering resources and delivering them to Bumpkins in the Plaza.",
          },
          {
            text: "You can also earn feathers by completing chores for Hank & claiming daily rewards!",
          },
          {
            text: "Gather enough feathers and you will be able to craft some wings like me. ",
          },
        ]}
      />
    );
  }

  if (showSeasonHelp) {
    return (
      <SpeakingModal
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.birdie}
        key="season"
        message={[
          {
            text: "Every 3 months a new season is introduced at Sunflower Land.",
          },
          {
            text: "We are in the enchanting Witches Eve season until the 1st of November!",
          },
          {
            text: "This season has exciting quests & rare collectibles you can earn.",
          },
          {
            text: "To craft these items, you must collect crow feathers and exchange them at the shops or the Auction house.",
            actions: [
              {
                text: "How do I earn feathers?",
                cb: () => setShowFeatherHelp(true),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <SpeakingModal
      onClose={() => {
        onClose();
        acknowledgeNPC("pumpkin' pete");
      }}
      bumpkinParts={NPC_WEARABLES.birdie}
      message={[
        {
          text: "Hey there, I'm Birdie, the most beautiful Bumpkin around!",
        },
        {
          text: "I noticed you admiring my Crow wings. Aren't they fantastic?!?",
        },
        {
          text: "We are currently in Witches' Eve Season and Bumpkins are going crazy for Crow Feathers.",
        },
        {
          text: "Collect enough feathers and you can craft rare NFTs. That's how I got these rare wings!",
          actions: [
            {
              text: "What is a season?",
              cb: () => setShowSeasonHelp(true),
            },
            {
              text: "How do I earn feathers?",
              cb: () => setShowFeatherHelp(true),
            },
          ],
        },
      ]}
    />
  );
};
