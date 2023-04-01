import React from "react";

import { DecorationItems } from "./DecorationItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  onClose: () => void;
}

export const DecorationShopItems: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      bumpkinParts={{
        body: "Beige Farmer Potion",
        hair: "Red Long Hair",
        pants: "Farmer Overalls",
        shirt: "Bumpkin Art Competition Merch",
        tool: "Farmer Pitchfork",
        background: "Farm Background",
        shoes: "Black Farmer Boots",
      }}
      tabs={[{ icon: SUNNYSIDE.icons.seeds, name: "Decorations" }]}
      onClose={onClose}
    >
      <DecorationItems />
    </CloseButtonPanel>
  );
};
