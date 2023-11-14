import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { TreasureShopSell } from "features/treasureIsland/components/TreasureShopSell";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}

export const GoldTooth: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES.goldtooth}
        onClose={() => setShowIntro(false)}
        message={[
          {
            text: "Arrr, me hearties! The treasure-diggin' area be teemin' with wealth and adventure, and it be openin' its gates soon for ye daring farmers!",
          },
          {
            text: "Be ready to join me crew, for the hunt for riches begins shortly!",
          },
        ]}
      />
    );
  }

  return (
    <>
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.goldtooth}
      >
        <TreasureShopSell />
      </CloseButtonPanel>
    </>
  );
};
