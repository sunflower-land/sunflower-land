import React from "react";
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
      onClose={onClose}
    >
      <div className="p-2">
        <p className="mb-4">
          Our bean shop is closing as our beans embark on a new journey with a
          mad scientist.
        </p>
        <p className="mb-4">{`Thank you for being part of our legume-loving community.`}</p>
        <p>Best regards,</p>
        <p>The Bean Team</p>
      </div>
    </CloseButtonPanel>
  );
};
