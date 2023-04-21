import React from "react";
import { ExoticSeeds } from "./ExoticSeeds";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  onClose: () => void;
}

export const ExoticShopItems: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      bumpkinParts={{
        body: "Dark Brown Farmer Potion",
        hair: "White Long Hair",
        pants: "Farmer Overalls",
        shirt: "Yellow Farmer Shirt",
        tool: "Farmer Pitchfork",
        background: "Farm Background",
        shoes: "Black Farmer Boots",
      }}
      tabs={[{ icon: SUNNYSIDE.icons.seeds, name: "Exotic" }]}
      onClose={onClose}
    >
      <ExoticSeeds onClose={onClose} />
    </CloseButtonPanel>
  );
};
