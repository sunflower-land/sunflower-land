import React from "react";

import well from "assets/buildings/well1.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";

export const WaterWell: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <img
        src={well}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        className="cursor-pointer hover:img-highlight relative bottom-2"
        onClick={handleClick}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}></Modal>
    </div>
  );
};
