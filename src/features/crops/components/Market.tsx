import React from "react";
import { Modal } from "react-bootstrap";

import market from "assets/buildings/market.gif";
import plant from "assets/icons/plant.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import { MarketItems } from "./MarketItems";

export const Market: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 4.5}px`,
        position: "absolute",
        left: `${GRID_WIDTH_PX * 15.5}px`,
        bottom: `${GRID_WIDTH_PX * 1.3}px`,
      }}
    >
      <img
        src={market}
        alt="market"
        onClick={() => setIsOpen(true)}
        style={{ filter: "drop-shadow(rgba(0, 0, 0, 0.3) 0px 3px 0.5px)" }}
        className="cursor-pointer w-full hover:img-highlight"
      />
      <Action
        className="absolute top-5 left-10"
        text="Shop"
        icon={plant}
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <MarketItems onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
