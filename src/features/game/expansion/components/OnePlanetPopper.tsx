import { Modal } from "components/ui/Modal";
import { SpecialEvent } from "features/game/types/specialEvents";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";
import bob from "assets/decorations/one_planet_bob.gif";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const OnePlanetPopper: React.FC<{ event: SpecialEvent | undefined }> = ({
  event,
}) => {
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  if (!event || !event.isEligible) return null;

  return (
    <>
      <img
        src={SUNNYSIDE.decorations.rewards_raft}
        className="absolute cursor-pointer"
        onClick={() => setShowSpecialEvent(true)}
        style={{
          width: `${60 * PIXEL_SCALE}px`,
          left: `${-24 * PIXEL_SCALE}px`,
          top: `${-16 * PIXEL_SCALE}px`,
        }}
      />
      <img
        src={bob}
        className="absolute cursor-pointer hover:img-highlight animate-float"
        onClick={() => setShowSpecialEvent(true)}
        style={{
          width: `${32 * PIXEL_SCALE}px`,
          left: `${0 * PIXEL_SCALE}px`,
          top: `${-30 * PIXEL_SCALE}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          left: `${8 * PIXEL_SCALE}px`,
          top: `${1 * PIXEL_SCALE}px`,
        }}
      />
      <Modal show={showSpecialEvent} onHide={() => setShowSpecialEvent(false)}>
        <CloseButtonPanel onClose={() => setShowSpecialEvent(false)}>
          <SpecialEventModalContent
            event={event}
            eventName="One Planet Popper"
            onClose={() => setShowSpecialEvent(false)}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
