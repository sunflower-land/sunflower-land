import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Bumpkin } from "features/game/types/game";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  bumpkin: Bumpkin;
}
export const BumpkinPainting: React.FC<Props> = ({ onClose, bumpkin }) => {
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel onClose={onClose}>
      <DynamicNFT showBackground bumpkinParts={bumpkin.equipped} />
      <p className="text-center text-xs my-2">
        {t("description.homeOwnerPainting")}
      </p>
    </CloseButtonPanel>
  );
};
