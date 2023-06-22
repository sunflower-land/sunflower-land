import React, { useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { InnerPanel } from "components/ui/Panel";
import { createPortal } from "react-dom";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";

export const DawnCountdown: React.FC = () => {
  const start = useCountdown(new Date("2023-07-03").getTime());
  const [showModal, setShowModal] = useState(false);
  return createPortal(
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          className="text-shadow"
          onClose={() => setShowModal(false)}
          bumpkinParts={NPC_WEARABLES.sofia}
        >
          <div className="p-2">
            <p className="text-sm mb-2">Calling all Bumpkins!</p>
            <p className="text-sm mb-2">
              The light is nearing and Dawn Breaker Island is becoming safe once
              again.
            </p>
            <p className="text-sm mb-2">
              We invite all Bumpkins to celebrate. There will be quests, prizes
              and special events!
            </p>
          </div>
        </CloseButtonPanel>
      </Modal>

      <InnerPanel
        className="fixed bottom-2 left-2 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div>
          <div className="flex">
            <img src={SUNNYSIDE.icons.heart} className="h-4 mr-1" />
            <p className="text-xs">Party starts</p>
            <img src={SUNNYSIDE.icons.heart} className="h-4 ml-1" />
          </div>
          <TimerDisplay time={start} />
        </div>
      </InnerPanel>
    </>,
    document.body
  );
};
