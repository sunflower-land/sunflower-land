import React from "react";
import { useState } from "react";
import { NPC, NPCProps } from "./NPC";
import { NPCModal } from "./NPCModal";

export const PlayerNPC: React.FC<NPCProps> = ({ parts: bumpkinParts }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NPC
        key={JSON.stringify(bumpkinParts)}
        parts={bumpkinParts}
        onClick={() => setOpen(true)}
      />

      <NPCModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
