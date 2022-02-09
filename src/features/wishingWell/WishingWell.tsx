import React from "react";
import { Modal } from "react-bootstrap";

import wishingWell from "assets/buildings/wishing_well.png";

import { WishingWellModal } from "./components/WishingWellModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const WishingWell: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        height: `${GRID_WIDTH_PX * 2.5}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -4}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 11}px)`,
      }}
    >
      <img
        src={wishingWell}
        alt="market"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:img-highlight w-full"
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <WishingWellModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
