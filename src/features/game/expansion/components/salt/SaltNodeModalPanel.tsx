import React from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { SaltNodeModalContent } from "./SaltNodeModalContent";

interface Props {
  onClose: () => void;
  id: string;
}

export const SaltNodeModalPanel: React.FC<Props> = ({ onClose, id }) => {
  return (
    <CloseButtonPanel
      onClose={onClose}
      container={OuterPanel}
      tabs={[
        {
          id: "saltFarm",
          name: "Salt Farm",
          icon: ITEM_DETAILS.Salt.image,
        },
      ]}
      currentTab="saltFarm"
    >
      <SaltNodeModalContent id={id} />
    </CloseButtonPanel>
  );
};
