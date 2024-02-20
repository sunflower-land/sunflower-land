import { Modal } from "components/ui/Modal";
import { SpecialEvent } from "features/game/types/specialEvents";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import React, { useState } from "react";

import raft from "assets/decorations/rewards_raft.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

export const OnePlanetPopper: React.FC<{ event: SpecialEvent | undefined }> = ({
  event,
}) => {
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  if (!event || !event.isEligible) return null;

  return (
    <>
      <img
        src={raft}
        className="absolute cursor-pointer"
        onClick={() => setShowSpecialEvent(true)}
        style={{
          width: `${60 * PIXEL_SCALE}px`,
          left: `${-24 * PIXEL_SCALE}px`,
          top: `${-16 * PIXEL_SCALE}px`,
        }}
      />
      {/* TODO: Update with Bob Planet */}
      <img
        src={ITEM_DETAILS["Freya Fox"].image}
        className="absolute cursor-pointer hover:img-highlight"
        onClick={() => setShowSpecialEvent(true)}
        style={{
          width: `${20 * PIXEL_SCALE}px`,
          left: `${0 * PIXEL_SCALE}px`,
          top: `${-16 * PIXEL_SCALE}px`,
        }}
      />
      <Modal show={showSpecialEvent} onHide={() => setShowSpecialEvent(false)}>
        <SpecialEventModalContent
          event={event}
          eventName="One Planet Popper"
          onClose={() => setShowSpecialEvent(false)}
        />
      </Modal>
    </>
  );
};
