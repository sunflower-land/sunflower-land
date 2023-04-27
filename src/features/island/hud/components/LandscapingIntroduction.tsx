import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import bush from "assets/icons/decoration.png";
import chest from "assets/icons/chest.png";
import { NPC_WEARABLES } from "lib/npcs";

function acknowledge() {
  localStorage.setItem("landscaping.introduction", "complete");
}

function hasSeenIntro() {
  return !!localStorage.getItem("landscaping.introduction");
}

export const LandscapingIntroduction: React.FC = () => {
  const [showModal, setShowModal] = useState(!hasSeenIntro());

  const onClose = () => {
    setShowModal(false);
    acknowledge();
  };

  return (
    <Modal centered show={showModal} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        title="Design your dream island!"
      >
        <div className="p-2">
          <div className="flex mb-1 items-center">
            <div className="relative mr-2">
              <img
                src={SUNNYSIDE.ui.round_button}
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
              />
              <img
                src={SUNNYSIDE.icons.drag}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 3}px`,
                  left: `${PIXEL_SCALE * 3}px`,
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">
              In design mode you can hold, drag & move items around.
            </p>
          </div>

          <div className="flex mb-1 items-center">
            <div className="relative mr-2">
              <img
                src={SUNNYSIDE.ui.round_button}
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
              />
              <img
                src={bush}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 4}px`,
                  left: `${PIXEL_SCALE * 3}px`,
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">Craft rare decorations</p>
          </div>
          <div className="flex mb-1 items-center">
            <div className="relative mr-2">
              <img
                src={SUNNYSIDE.ui.round_button}
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
              />
              <img
                src={chest}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 4}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                  width: `${PIXEL_SCALE * 10}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">Place collectibles from your chest</p>
          </div>
        </div>
        <Button onClick={onClose}>Got it</Button>
      </CloseButtonPanel>
    </Modal>
  );
};
