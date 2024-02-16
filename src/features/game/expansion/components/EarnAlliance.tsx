import { SpecialEvent } from "features/game/types/specialEvents";
import { NPC } from "features/island/bumpkin/components/NPC";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export const EarnAlliance: React.FC<{ event: SpecialEvent | undefined }> = ({
  event,
}) => {
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  if (!event || !event.isEligible) return null;

  return (
    <>
      <NPC
        parts={NPC_WEARABLES["pumpkin' pete"]}
        onClick={() => setShowSpecialEvent(true)}
      />
      <Modal
        show={showSpecialEvent}
        centered
        onHide={() => setShowSpecialEvent(false)}
      >
        <SpecialEventModalContent
          event={event}
          eventName="Earn Alliance Banner"
          npcName="pumpkin' pete"
          onClose={() => setShowSpecialEvent(false)}
        />
      </Modal>
    </>
  );
};
