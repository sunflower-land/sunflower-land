import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { TreasureShopSell } from "features/treasureIsland/components/TreasureShopSell";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { translate } from "lib/i18n/translate";

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
            text: translate("goldTooth.intro.part1"),
          },
          {
            text: translate("goldTooth.intro.part2"),
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
