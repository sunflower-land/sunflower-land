import React from "react";
import { Modal } from "react-bootstrap";

import bakery from "assets/buildings/house.png";
import soup from "assets/icons/bakery.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Bakery: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 5}px`,
        height: `${GRID_WIDTH_PX * 2.9}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -13}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 17}px)`,
      }}
    >
      <img
        src={bakery}
        alt="market"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:img-highlight"
        style={{
          width: "100px",
        }}
      />
      <Action
        className="absolute -bottom-8 left-0"
        text="Bake"
        icon={soup}
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
