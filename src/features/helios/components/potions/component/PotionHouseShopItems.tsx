import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { PotionHouseItems } from "./PotionHouseItems";

interface Props {
  onClose: () => void;
}

export const PotionHouseShopItems: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.garth}
      tabs={[{ icon: SUNNYSIDE.icons.water, name: "Potion Shop" }]}
      onClose={onClose}
    >
      <PotionHouseItems />
    </CloseButtonPanel>
  );
};
