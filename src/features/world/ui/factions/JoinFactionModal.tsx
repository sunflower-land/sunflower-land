import React from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { JoinFaction } from "./JoinFaction";

interface Props {
  npc: "graxle" | "barlow" | "nyx" | "reginald";
  onClose: () => void;
}

export const JoinFactionModal: React.FC<Props> = ({ npc, onClose }) => {
  enum Faction {
    "graxle" = "goblins",
    "reginald" = "sunflorians",
    "barlow" = "bumpkins",
    "nyx" = "nightshades",
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES[npc]}>
      <JoinFaction faction={Faction[npc]} onClose={onClose} />
    </CloseButtonPanel>
  );
};
