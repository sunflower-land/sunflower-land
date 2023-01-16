import React from "react";

import { Modal } from "react-bootstrap";

import kitchen from "assets/buildings/bakery_building.png";
import pumpkinSoup from "assets/sfts/pumpkin_soup.png";
import { HowToModalHeader } from "./HowToModalHeader";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

export const HowToUpgrade: React.FC<Props> = ({ onClose, onBack }) => {
  return (
    <>
      <HowToModalHeader
        title="How to upgrade?"
        onClose={onClose}
        onBack={onBack}
      />
      <Modal.Body>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">
            1. Talk to a Goblin blocking the fields
          </p>
          <div className="relative w-12 h-12">
            <img
              src={SUNNYSIDE.npcs.goblin}
              style={{
                width: `${GRID_WIDTH_PX}px`,
                position: "absolute",
                top: "0",
                right: "0",
              }}
            />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 bottom-0"
            />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">
            2.Visit the town & click on the kitchen
          </p>
          <div className="relative">
            <img src={kitchen} className="w-14" />
            <img
              src={SUNNYSIDE.ui.cursor}
              className="w-4 absolute right-0 -bottom-2"
            />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">
            3. Craft the food that the goblin wants
          </p>
          <div className="relative">
            <img src={pumpkinSoup} className="w-14 relative left-1" />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">
            4. Voila! Enjoy your new fields and crops
          </p>
          <div className="relative">
            <img src={CROP_LIFECYCLE.Carrot.crop} className="w-14 relative" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
