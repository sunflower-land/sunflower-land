import React from "react";
import { Modal } from "react-bootstrap";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/farmersMarket.png";
import retroGirl from "assets/npcs/exotic_girl.gif";
import shadow from "assets/npcs/shadow.png";

import { ExoticShopItems } from "./component/ExoticShopItems";

export const ExoticShop: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        // TODO some sort of coordinate system
        style={{
          right: `${GRID_WIDTH_PX * 12}px`,
          top: `${GRID_WIDTH_PX * 25.2}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${GRID_WIDTH_PX * 3.2}px`,
            top: `${GRID_WIDTH_PX * 2.85}px`,
          }}
        />
        <img
          src={retroGirl}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${GRID_WIDTH_PX * 3.2}px`,
            top: `${GRID_WIDTH_PX * 2}px`,
            transform: "scaleX(-1)",
          }}
        />
        <img
          src={building}
          style={{
            width: `${PIXEL_SCALE * 80}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <ExoticShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
