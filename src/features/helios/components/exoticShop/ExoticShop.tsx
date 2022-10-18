import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/farmersMarket.png";
import { Modal } from "react-bootstrap";
import { ExoticShopItems } from "./component/ExoticShopItems";

export const ExoticShop: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      {" "}
      <div
        className="z-10 absolute cursor-pointer hover:img-highlight"
        // TODO some sort of coordinate system
        style={{
          right: `${GRID_WIDTH_PX * 12}px`,
          top: `${GRID_WIDTH_PX * 25.2}px`,
        }}
        onClick={handleClick}
      >
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
