import classNames from "classnames";
import { OuterPanel } from "components/ui/Panel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React from "react";
import { DeliveryPanelContent } from "./DeliveryPanelContent";

interface Props {
  npc: NPCName;
  className?: string;
  onClose: () => void;
}

export const DeliveryPanel: React.FC<Props> = ({ npc, className, onClose }) => {
  return (
    <OuterPanel
      className={classNames("relative w-full", className)}
      bumpkinParts={NPC_WEARABLES[npc]}
    >
      <DeliveryPanelContent npc={npc} onClose={onClose} />
    </OuterPanel>
  );
};
