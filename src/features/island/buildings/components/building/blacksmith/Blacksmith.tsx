import React from "react";

import blacksmith from "assets/buildings/blacksmith.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Crafting } from "features/farming/blacksmith/components/Crafting";

export const Blacksmith: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <img
        src={blacksmith}
        draggable={false}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
        }}
        className="cursor-pointer hover:img-highlight"
        onClick={handleClick}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
