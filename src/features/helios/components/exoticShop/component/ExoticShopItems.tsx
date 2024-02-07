import React from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const ExoticShopItems: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
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
        <p className="mb-4">{t("exoticShopItems.line1")}</p>
        <p className="mb-4">{t("exoticShopItems.line2")}</p>
        <p>{t("exoticShopItems.line3")}</p>
        <p>{t("exoticShopItems.line4")}</p>
      </div>
    </CloseButtonPanel>
  );
};
