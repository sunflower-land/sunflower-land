import React from "react";
import blacksmith from "assets/buildings/goblin_blacksmith.gif";
import hammer from "assets/icons/hammer.png";

import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { blacksmithAudio } from "lib/utils/sfx";
import { ItemsModal } from "./ItemsModal";

export const Blacksmith: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBlacksmith = () => {
    setIsOpen(true);
    blacksmithAudio.play();
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 7.1}px`,
        right: `${GRID_WIDTH_PX * 1.1}px`,
        top: `${GRID_WIDTH_PX * 10.7}px`,
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
          className="absolute bottom-0 left-24"
          text="Craft"
          icon={hammer}
          onClick={openBlacksmith}
        />
      </div>
      <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
