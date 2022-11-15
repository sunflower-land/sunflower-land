import React from "react";

import market from "assets/buildings/market.png";
import betty from "assets/npcs/betty.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { ShopItems } from "./ShopItems";

export const Market: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 48}px`,
      }}
    >
      <img
        src={market}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
        }}
        className="cursor-pointer hover:img-highlight"
        onClick={handleClick}
      />
      <img
        src={shadow}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `${PIXEL_SCALE * 6}px`,
          right: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        src={betty}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 8}px`,
          right: `${PIXEL_SCALE * 4}px`,
          transform: "scaleX(-1)",
        }}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <ShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
