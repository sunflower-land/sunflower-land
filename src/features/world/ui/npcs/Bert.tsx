import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";

import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
}

export const Bert: React.FC<Props> = ({ onClose }) => (
  <CloseButtonPanel
    onClose={onClose}
    bumpkinParts={NPC_WEARABLES.bert}
    container={OuterPanel}
    tabs={[{ icon: SUNNYSIDE.icons.expression_chat, name: "Delivery" }]}
  >
    <DeliveryPanelContent npc="bert" />
  </CloseButtonPanel>
);
