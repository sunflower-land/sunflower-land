import React from "react";

import { Modal } from "react-bootstrap";

import goblin from "assets/npcs/goblin.gif";
import cursor from "assets/ui/cursor.png";
import kitchen from "assets/buildings/bakery_building.png";
import pumpkinSoup from "assets/nfts/pumpkin_soup.png";
import carrot from "assets/crops/carrot/plant.png";
import { HowToModalHeader } from "./HowToModalHeader";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

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
              src={goblin}
              style={{
                width: `${GRID_WIDTH_PX}px`,
                position: "absolute",
                top: "0",
                right: "0",
              }}
            />
            <img src={cursor} className="w-4 absolute right-0 bottom-0" />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">
            2.Visit the town & click on the kitchen
          </p>
          <div className="relative">
            <img src={kitchen} className="w-14" />
            <img src={cursor} className="w-4 absolute right-0 -bottom-2" />
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
            <img src={carrot} className="w-14 relative" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
