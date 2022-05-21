import React from "react";

import brokenRocket from "assets/buildings/mom_broken_rocket.gif";
import momNpc from "assets/npcs/mom_npc.gif";
import close from "assets/icons/close.png";
import questionMark from "assets/icons/expression_confused.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ItemsModal } from "./ItemsModal";

export const Rocket: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isItemsOpen, setIsItemsOpen] = React.useState(false);

  const openRocket = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsItemsOpen(false);
  };

  const content = () => {
    if (isItemsOpen) {
      return <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
    }

    return (
      <Panel>
        <div className="flex items-start">
          <img src={questionMark} className="w-12 img-highlight mr-2" />
          <div className="flex-1">
            <span className="text-shadow mr-4 block">
              A rocket has crash landed in Sunflower Land and Melon Dusk needs
              help to go back to Mars.
            </span>
            <Button className="text-sm" onClick={() => setIsItemsOpen(true)}>
              Fix rocket
            </Button>
          </div>
        </div>
      </Panel>
    );
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5}px`,
        right: `${GRID_WIDTH_PX * 9.75}px`,
        top: `${GRID_WIDTH_PX * 20}px`,
      }}
    >
      <div className="absolute cursor-pointer hover:img-highlight w-full">
        <img
          src={momNpc}
          style={{
            position: "absolute",
            width: `${GRID_WIDTH_PX * 1.3}px`,
            top: `${GRID_WIDTH_PX * 2.5}px`,
            right: `${GRID_WIDTH_PX * 3.75}px`,
          }}
          // className="absolute cursor-pointer hover:img-highlight"
          onClick={openRocket}
        />
        <img src={brokenRocket} className="w-56" onClick={openRocket} />
      </div>

      {isOpen && (
        <Modal centered show={isOpen} onHide={closeModal}>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
          {content()}
        </Modal>
      )}
    </div>
  );
};
