import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/decorations.png";
import { Modal } from "react-bootstrap";
import { DecorationShopItems } from "./component/DecorationShopItems";

export const Decorations: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };
  return (
    <>
      <div
        className="z-10 absolute cursor-pointer hover:img-highlight"
        // TODO some sort of coordinate system
        style={{
          width: `${GRID_WIDTH_PX * 6}px`,
          right: `${GRID_WIDTH_PX * 17.6}px`,
          top: `${GRID_WIDTH_PX * 25.2}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={building}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <DecorationShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
