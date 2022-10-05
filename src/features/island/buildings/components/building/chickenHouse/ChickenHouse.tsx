import React from "react";

import building from "assets/buildings/chicken_house.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { ChickenHouseModal } from "./components/ChickenHouseModal";

export const ChickenHouse: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="h-full w-full flex items-end">
      <img
        src={building}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          left: `${PIXEL_SCALE * 1}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        className="cursor-pointer hover:img-highlight absolute"
        onClick={handleClick}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <ChickenHouseModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
