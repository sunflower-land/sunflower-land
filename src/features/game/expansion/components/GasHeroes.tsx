import { Modal } from "components/ui/Modal";
import { SpecialEvent } from "features/game/types/specialEvents";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import React, { useState } from "react";

import raft from "assets/map/gas-heroes-island.png";
import shadow from "assets/npcs/shadow.png";
import nightshade from "assets/npcs/nightshade.gif";
import nightshadeBumpkin from "assets/npcs/nightshade_bumpkin.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const GasHeroes: React.FC<{ event: SpecialEvent | undefined }> = ({
  event,
}) => {
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  if (!event || !event.isEligible || event.startAt > Date.now()) return null;

  return (
    <>
      <img
        src={raft}
        className="absolute cursor-pointer"
        onClick={() => setShowSpecialEvent(true)}
        style={{
          width: `${78 * PIXEL_SCALE}px`,
          left: `${-24 * PIXEL_SCALE}px`,
          top: `${-16 * PIXEL_SCALE}px`,
        }}
      />
      <img
        src={nightshade}
        className="absolute cursor-pointer hover:img-highlight z-10"
        onClick={() => setShowSpecialEvent(true)}
        style={{
          width: `${20 * PIXEL_SCALE}px`,
          left: `${20 * PIXEL_SCALE}px`,
          top: `${12 * PIXEL_SCALE}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${16 * PIXEL_SCALE}px`,
          left: `${22 * PIXEL_SCALE}px`,
          top: `${27 * PIXEL_SCALE}px`,
        }}
      />
      <Modal show={showSpecialEvent} onHide={() => setShowSpecialEvent(false)}>
        <CloseButtonPanel onClose={() => setShowSpecialEvent(false)}>
          <div
            className="absolute pointer-events-none"
            style={{
              zIndex: -10,
              top: `${PIXEL_SCALE * -61}px`,
              left: `${PIXEL_SCALE * -8}px`,
              width: `${PIXEL_SCALE * 100}px`,
            }}
          >
            <img src={nightshadeBumpkin} className="w-full" />
          </div>
          <SpecialEventModalContent
            event={event}
            eventName="Gas Hero"
            onClose={() => setShowSpecialEvent(false)}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
