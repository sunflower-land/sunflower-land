import React from "react";

import tent from "assets/buildings/tent2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";

export const Tent: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="h-full w-full flex items-end">
      <img
        src={tent}
        style={{
          width: `${PIXEL_SCALE * 46}px`,
        }}
        className="cursor-pointer hover:img-highlight"
        onClick={handleClick}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}></Modal>
    </div>
  );
};
