import React from "react";

import { DecorationItems } from "./DecorationItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { BASIC_DECORATIONS } from "features/game/types/decorations";

interface Props {
  onClose: () => void;
}

export const DecorationShopItems: React.FC<Props> = ({ onClose }) => (
  <CloseButtonPanel
    bumpkinParts={NPC_WEARABLES.frankie}
    tabs={[{ icon: SUNNYSIDE.icons.heart, name: "Decorations" }]}
    onClose={onClose}
  >
    <DecorationItems items={BASIC_DECORATIONS()} />
  </CloseButtonPanel>
);
