import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import tree from "assets/events/valentine/decorations/blossom_tree.png";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

import { ValentineEventDonation } from "features/community/valentineEvent/valentineEventDonation";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const BlossomTree: React.FC = () => {
  const [showDonation, setShowDonation] = React.useState(false);
  return (
    <>
      <MapPlacement x={-8.5} y={7.3} width={3}>
        <div className="relative w-full h-full">
          <img
            src={tree}
            className="absolute z-20 hover:cursor-pointer hover:img-highlight"
            style={{
              width: `${PIXEL_SCALE * 32}px`,
            }}
            onClick={() => setShowDonation(true)}
          />
        </div>
      </MapPlacement>

      {showDonation && (
        <Modal
          show={showDonation}
          onHide={() => setShowDonation(false)}
          centered
        >
          <CloseButtonPanel
            title="Wants to support more events like this?!"
            onClose={() => setShowDonation(false)}
          >
            <ValentineEventDonation />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
