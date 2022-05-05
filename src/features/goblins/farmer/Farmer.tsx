import React from "react";

import wheatGoblin from "assets/npcs/wheat_goblin.gif";
import cowbell from "assets/skills/barn_manager.png";
import { barnAudio } from "lib/utils/sfx";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { ItemsModal } from "./ItemsModal";

export const Farmer: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBarn = () => {
    setIsOpen(true);
    barnAudio.play();
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 0.9}px`,
        right: `${GRID_WIDTH_PX * 12.7}px`,
        top: `${GRID_WIDTH_PX * 2.4}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={wheatGoblin}
          alt="barn"
          onClick={openBarn}
          className="w-full"
        />
        <Action
          className="absolute -bottom-10 -left-11"
          text="Farmer"
          icon={cowbell}
          onClick={openBarn}
        />
      </div>
      <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
