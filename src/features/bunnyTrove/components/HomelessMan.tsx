import React, { useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import homeless from "assets/events/easter/2023/npcs/homeless.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BunnyTroveEventDonation } from "features/community/donation/BunnyTroveDonation";

export const HomelessMan: React.FC = () => {
  const [showDonation, setShowDonation] = useState(false);
  return (
    <>
      <MapPlacement x={-1.5} y={4.5} height={1} width={2.5}>
        <div className="relative w-full h-full">
          <img
            src={homeless}
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
            bumpkinParts={{
              body: "Light Brown Farmer Potion",
              hair: "Blacksmith Hair",
              pants: "Farmer Pants",
              shirt: "Developer Hoodie",
              tool: "Bumpkin Puppet",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
            title="Wants to support more events like this?!"
            onClose={() => setShowDonation(false)}
          >
            <BunnyTroveEventDonation />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
