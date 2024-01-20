import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Bumpkin } from "features/game/types/game";
import React from "react";
import { translate } from "lib/i18n/translate";

interface Props {
  onClose: () => void;
  bumpkin: Bumpkin;
}
export const BumpkinPainting: React.FC<Props> = ({ onClose, bumpkin }) => {
  return (
    <CloseButtonPanel onClose={onClose}>
      <DynamicNFT showBackground bumpkinParts={bumpkin.equipped} />
      <p className="text-center text-xs my-2">
        {translate("description.homeOwnerPainting")}
      </p>
    </CloseButtonPanel>
  );
};
