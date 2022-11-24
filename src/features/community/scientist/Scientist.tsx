import React from "react";

import scientist from "../assets/lab.gif";
import icon from "../assets/icons/pot.png";

import { ScientistModal } from "./ScientistModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { merchantAudio } from "lib/utils/sfx";

export const Scientist: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openMerchant = () => {
    setIsOpen(true);
    //Checks if merchantAudio is playing, if false, plays the sound
    if (!merchantAudio.playing()) {
      merchantAudio.play();
    }
  };

  return (
    <div
      className="relative"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 7.5}px`,
        top: `${GRID_WIDTH_PX * 25}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight relative">
        <img
          src={scientist}
          alt="scientist"
          onClick={openMerchant}
          className="w-full"
        />
        <Action
          className="absolute -bottom-[30px] -left-[5px]"
          text="Scientist"
          icon={icon}
          onClick={openMerchant}
        />
      </div>

      {isOpen && (
        <ScientistModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
