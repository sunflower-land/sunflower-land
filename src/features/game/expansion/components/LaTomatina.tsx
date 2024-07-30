import { Modal } from "components/ui/Modal";
import { SpecialEvent } from "features/game/types/specialEvents";
import { SpecialEventModalContent } from "features/world/ui/SpecialEventModalContent";
import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC } from "features/island/bumpkin/components/NPC";

export const LaTomatina: React.FC<{ event: SpecialEvent | undefined }> = ({
  event,
}) => {
  const [showSpecialEvent, setShowSpecialEvent] = useState(false);

  if (
    !event ||
    !event.isEligible ||
    event.endAt < Date.now() ||
    event.startAt > Date.now()
  )
    return null;

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
      <div
        style={{
          width: `${32 * PIXEL_SCALE}px`,
          left: `${8 * PIXEL_SCALE}px`,
          top: `${-20 * PIXEL_SCALE}px`,
        }}
        onClick={() => setShowSpecialEvent(true)}
        className="absolute cursor-pointer hover:img-highlight"
      >
        <NPC
          parts={{
            hat: "Feather Hat",
            body: "Infernal Bumpkin Potion",
            shirt: "Club Polo",

            hair: "Basic Hair",
            pants: "Wise Slacks",
            tool: "Auction Megaphone",
            shoes: "Black Farmer Boots",
            background: "Farm Background",
          }}
        />
      </div>

      <Modal show={showSpecialEvent} onHide={() => setShowSpecialEvent(false)}>
        <CloseButtonPanel onClose={() => setShowSpecialEvent(false)}>
          <SpecialEventModalContent
            event={event}
            eventName="La Tomatina"
            onClose={() => setShowSpecialEvent(false)}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
