import React, { useState } from "react";
import raft from "assets/decorations/raft.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Guide } from "features/helios/components/hayseedHank/components/Guide";
import { SUNNYSIDE } from "assets/sunnyside";

export const TravelTeaser: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          onClose={() => setShowModal(false)}
          tabs={[
            {
              icon: SUNNYSIDE.icons.hammer,
              name: "Task",
            },
            {
              icon: SUNNYSIDE.icons.expression_confused,
              name: "Guide",
            },
          ]}
        >
          <div
            style={{ maxHeight: "300px" }}
            className="scrollable overflow-y-auto"
          >
            <Guide onSelect={() => {}} />
          </div>
        </CloseButtonPanel>
      </Modal>
      <div
        className="absolute"
        style={{
          top: `${2 * PIXEL_SCALE}px`,
          left: `${2 * PIXEL_SCALE}px`,
        }}
      >
        <img
          src={raft}
          style={{
            width: `${37 * PIXEL_SCALE}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            top: `${-10 * PIXEL_SCALE}px`,
            left: `${12 * PIXEL_SCALE}px`,
          }}
        >
          <NPC
            parts={NPC_WEARABLES["pumpkin' pete"]}
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>
    </>
  );
};
