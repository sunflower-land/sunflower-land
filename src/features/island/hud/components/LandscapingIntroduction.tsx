import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import scarecrow from "assets/icons/scarecrow.png";
import bush from "assets/icons/decoration.png";
import chest from "assets/icons/chest.png";
import { ITEM_DETAILS } from "features/game/types/images";

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
        bumpkinParts={{
          body: "Goblin Potion",
          shirt: "Red Farmer Shirt",
          pants: "Lumberjack Overalls",
          hair: "Blacksmith Hair",
          tool: "Hammer",
        }}
        title="Time to build!"
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
              In build mode you can hold, drag & move items around.
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
                src={scarecrow}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 2}px`,
                  left: `${PIXEL_SCALE * 3}px`,
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">
              Craft equipment & boost your farming
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
                src={ITEM_DETAILS["Water Well"].image}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 3}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                  width: `${PIXEL_SCALE * 10}px`,
                }}
              />
            </div>
            <p className="text-sm flex-1">Craft buildings & unlock resources</p>
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
