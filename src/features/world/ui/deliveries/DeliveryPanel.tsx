import classNames from "classnames";
import { Panel } from "components/ui/Panel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React from "react";
import { DeliveryPanelContent } from "./DeliveryPanelContent";
import { BumpkinDelivery } from "./BumpkinDelivery";

interface Props {
  npc: NPCName;
  className?: string;
  onClose: () => void;
}

export const DeliveryPanel: React.FC<Props> = ({ npc, className, onClose }) => {
  // TODO feature flag
  return <BumpkinDelivery npc={npc} onClose={onClose} />;
  return (
    <Panel
      className={classNames("relative w-full", className)}
      bumpkinParts={NPC_WEARABLES[npc]}
    >
      <DeliveryPanelContent npc={npc} onClose={onClose} />
    </Panel>
  );
};
