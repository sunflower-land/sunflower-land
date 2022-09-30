import React from "react";

import resources from "assets/buildings/resources.png";
import token from "assets/resources/wood.png";
import goblin from "assets/npcs/goblin.gif";

import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { StorageModal } from "features/goblins/storageHouse/components/StorageModal";

export const RetreatStorageHouse: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openStorageHouse = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="z-10 absolute"
        style={{
          width: `${GRID_WIDTH_PX * 5.5}px`,
          right: `${GRID_WIDTH_PX * 10.5}px`,
          top: `${GRID_WIDTH_PX * 12}px`,
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
            alt="storage-house"
            onClick={openStorageHouse}
            className="w-full"
          />
          <Action
            className="absolute -bottom-2 left-10"
            text="Storage"
            icon={token}
            onClick={openStorageHouse}
          />
        </div>
      </div>
      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <StorageModal onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
