import React from "react";
import { Modal } from "react-bootstrap";

import wishingWell from "assets/buildings/wishing_well.png";
import icon from "assets/brand/icon.png";

import { WishingWellModal } from "./components/WishingWellModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

export const WishingWell: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
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
      <Action
        className="absolute -bottom-8 -left-2"
        text="Wish"
        icon={icon}
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <WishingWellModal
          key={isOpen ? "1" : "0"}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};
