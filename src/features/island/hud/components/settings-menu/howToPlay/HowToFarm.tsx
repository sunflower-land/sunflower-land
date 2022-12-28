import React from "react";

import { Modal } from "react-bootstrap";

import sunflower from "assets/crops/sunflower/planted.png";
import seedling from "assets/crops/sunflower/seedling.png";
import seed from "assets/crops/sunflower/seed.png";
import cursor from "assets/ui/cursor.png";
import token from "assets/icons/token_2.png";

import shop from "assets/buildings/shop_building.png";
import { HowToModalHeader } from "./HowToModalHeader";

interface Props {
  onClose: () => void;
}

export const HowToFarm: React.FC<Props> = ({ onClose }) => {
  return (
    <>
      <HowToModalHeader title="How to Farm?" onClose={onClose} />
      <Modal.Body>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">
            1.Harvest crops when they are ready
          </p>
          <div className="relative">
            <img src={sunflower} className="w-12" />
            <img src={cursor} className="w-4 absolute right-0 bottom-0" />
          </div>
        </div>
        <div className="flex  items-center mt-2 ">
          <p className="text-xs sm:text-sm p-2">
            2.Visit the town & click on the shop
          </p>
          <div className="relative">
            <img src={shop} className="w-14" />
            <img src={cursor} className="w-4 absolute right-0 -bottom-2" />
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-xs sm:text-sm p-2">
            3.Sell crops at the shop for SFL
          </p>

          <div className="relative">
            <img src={token} className="w-12" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs sm:text-sm p-2">4.Buy seeds using your SFL</p>
          <div className="relative">
            <img src={seed} className="w-8" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs sm:text-sm p-2">5. Plant seeds and wait</p>
          <div className="relative">
            <img src={seedling} className="w-12" />
            <img src={cursor} className="w-4 absolute right-0 bottom-0" />
          </div>
        </div>
      </Modal.Body>
    </>
  );
};
