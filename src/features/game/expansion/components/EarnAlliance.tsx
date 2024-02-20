import { Modal } from "components/ui/Modal";
import { SpecialEvent } from "features/game/types/specialEvents";
import { NPC } from "features/island/bumpkin/components/NPC";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";

import raft from "assets/decorations/earn_alliance_raft.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
export const EarnAlliance: React.FC<{ event: SpecialEvent | undefined }> = ({
  event,
}) => {
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  if (!event || !event.isEligible) return null;

  return (
    <>
      <img
        src={raft}
        className="absolute"
        style={{
          width: `${60 * PIXEL_SCALE}px`,
          left: `${-24 * PIXEL_SCALE}px`,
          top: `${-16 * PIXEL_SCALE}px`,
        }}
      />
      <NPC
        parts={NPC_WEARABLES["evie"]}
        onClick={() => setShowSpecialEvent(true)}
      />
      <Modal show={showSpecialEvent} onHide={() => setShowSpecialEvent(false)}>
        <SpecialEventModalContent
          event={event}
          eventName="Earn Alliance Banner"
          npcName="evie"
          onClose={() => setShowSpecialEvent(false)}
        />
      </Modal>
    </>
  );
};
