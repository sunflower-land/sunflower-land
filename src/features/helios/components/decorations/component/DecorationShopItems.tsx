import React from "react";

import { DecorationItems } from "./DecorationItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  onClose: () => void;
}

export const DecorationShopItems: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.frankie}
      tabs={[{ icon: SUNNYSIDE.icons.seeds, name: "Decorations" }]}
      onClose={onClose}
    >
      <DecorationItems />
    </CloseButtonPanel>
  );
};
