import React from "react";
import { DeliveryPanel } from "../deliveries/DeliveryPanel";
import { NPC_WEARABLES, acknowedlgedNPCs, acknowledgeNPC } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";

interface Props {
  onClose: () => void;
}
export const Pete: React.FC<Props> = ({ onClose }) => {
  if (!acknowedlgedNPCs()["pumpkin' pete"]) {
    return (
      <SpeakingModal
        onClose={() => {
          onClose();
          acknowledgeNPC("pumpkin' pete");
        }}
        bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
        message={[
          {
            text: "Welcome to the Pumpkin Plaza! I'm Pumpkin Pete.",
          },
          {
            text: "The plaza is where you can find the Blacksmith, Auction House + other shops.",
          },
          {
            text: "The shop owners are going crazy for Crow Feathers. If you collect these, you'll be able to exchange them for rare NFTs & collectibles.",
          },
          {
            text: "There are always exciting special events happening in the plaza so make sure you keep your eyes peeled. Good luck!",
          },
        ]}
      />
    );
  }
  return <DeliveryPanel npc={"pumpkin' pete"} onClose={onClose} />;
};
