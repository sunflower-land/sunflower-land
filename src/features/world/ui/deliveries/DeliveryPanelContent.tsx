import React from "react";
import type { NPCName } from "lib/npcs";

import { BumpkinDelivery } from "./BumpkinDelivery";

interface Props {
  onClose?: () => void;
  npc: NPCName;
}

export const DeliveryPanelContent: React.FC<Props> = ({ npc, onClose }) => {
  return <BumpkinDelivery npc={npc} onClose={onClose} />;
};
