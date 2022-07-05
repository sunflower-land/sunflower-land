import React from "react";

import resources from "assets/buildings/resources.png";
import token from "assets/resources/wood.png";
import goblin from "assets/npcs/goblin.gif";

import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { StorageModal } from "./components/StorageModal";

export const StorageHouse: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const openBank = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="z-10 absolute"
        style={{
          width: `${GRID_WIDTH_PX * 5.5}px`,
          right: `${GRID_WIDTH_PX * 19.5}px`,
          top: `${GRID_WIDTH_PX * 10}px`,
        }}
      >
        <div className="cursor-pointer hover:img-highlight">
          <img
            src={goblin}
            style={{
              width: `${GRID_WIDTH_PX * 1}px`,
              right: `${GRID_WIDTH_PX * 2.35}px`,
              top: `${GRID_WIDTH_PX * 3.8}px`,
            }}
            className="absolute"
          />

          <img
            src={resources}
            alt="bank"
            onClick={openBank}
            className="w-full"
          />
          <Action
            className="absolute -bottom-2 left-10"
            text="Storage"
            icon={token}
            onClick={openBank}
          />
        </div>
      </div>
      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <StorageModal onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
