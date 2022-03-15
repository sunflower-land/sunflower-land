import React from "react";

import { Modal } from "react-bootstrap";

import goblin from "assets/npcs/goblin.gif";
import cursor from "assets/ui/cursor.png";
import kitchen from "assets/buildings/bakery_building.png";
import pumpkinSoup from "assets/nfts/pumpkin_soup.png";
import carrot from "assets/crops/carrot/plant.png";

export const HowToUpgrade: React.FC = () => {
  return (
    <>
      <Modal.Header className="justify-content-space-between">
        <h1 className="ml-2">How to upgrade?</h1>
      </Modal.Header>
      <Modal.Body>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">
            1. Talk to a Goblin blocking the fields
          </p>
          <div className="relative w-12 h-12">
            <img
              src={goblin}
              style={{
                width: "180px",
                maxWidth: "180px",
                position: "absolute",
                top: "-35px",
                right: "-69px",
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
