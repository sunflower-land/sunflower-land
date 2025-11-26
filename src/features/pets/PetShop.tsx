import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React from "react";
import { PetShopModal } from "./PetShopModal";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onClose: () => void;
}

export const PetShop: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      tabs={[
        {
          icon: ITEM_DETAILS.Barkley.image,
          name: "Pet Shop",
        },
      ]}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.chase}
      container={OuterPanel}
    >
      <PetShopModal />
    </CloseButtonPanel>
  );
};
