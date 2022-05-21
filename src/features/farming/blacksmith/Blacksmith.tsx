import React from "react";
import { Modal } from "react-bootstrap";

import blacksmith from "assets/buildings/blacksmith_building.gif";
import hammer from "assets/icons/hammer.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { blacksmithAudio } from "lib/utils/sfx";

export const Blacksmith: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBlacksmith = () => {
    setIsOpen(true);
    if (!blacksmithAudio.playing()) {
      blacksmithAudio.play();
    }
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 6}px`,
        left: `${GRID_WIDTH_PX * 9}px`,
        top: `${GRID_WIDTH_PX * 6}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={blacksmith}
          alt="market"
          onClick={openBlacksmith}
          className="w-full"
        />
        <Action
          className="absolute -bottom-8 left-1"
          text="Craft"
          icon={hammer}
          onClick={openBlacksmith}
        />
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
