import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Bumpkin } from "features/game/types/game";
import React from "react";

interface Props {
  onClose: () => void;
  bumpkin: Bumpkin;
}
export const BumpkinPainting: React.FC<Props> = ({ onClose, bumpkin }) => {
  return (
    <CloseButtonPanel onClose={onClose}>
      <DynamicNFT showBackground bumpkinParts={bumpkin.equipped} />
      <p className="text-center text-xs my-2">
        A painting of the owner of this home.
      </p>
    </CloseButtonPanel>
  );
};
