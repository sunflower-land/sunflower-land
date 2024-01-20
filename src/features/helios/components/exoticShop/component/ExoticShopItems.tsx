import React from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { translate } from "lib/i18n/translate";

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
        <p className="mb-4">{translate("exoticShopItems.line1")}</p>
        <p className="mb-4">{translate("exoticShopItems.line2")}</p>
        <p>{translate("exoticShopItems.line3")}</p>
        <p>{translate("exoticShopItems.line4")}</p>
      </div>
    </CloseButtonPanel>
  );
};
