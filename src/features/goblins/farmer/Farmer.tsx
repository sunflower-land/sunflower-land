import React from "react";

import goblinFarmer from "assets/npcs/goblin_farmer.gif";
import cowbell from "assets/skills/barn_manager.png";
import { barnAudio } from "lib/utils/sfx";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { ItemsModal } from "./ItemsModal";

export const Farmer: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBarn = () => {
    setIsOpen(true);
    //Checks if barnAudio is playing, if false, plays the sound
    if (!barnAudio.playing()) {
      barnAudio.play();
    }
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 1.5}px`,
        right: `${GRID_WIDTH_PX * 13.14}px`,
        top: `${GRID_WIDTH_PX * 1.9}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={goblinFarmer}
          alt="farmer"
          onClick={openBarn}
          className="w-full"
        />
        <Action
          className="absolute -bottom-10 -left-1"
          text="Farmer"
          icon={cowbell}
          onClick={openBarn}
        />
      </div>
      <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
