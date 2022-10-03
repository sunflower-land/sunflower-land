import React from "react";

import goblinTailor from "assets/buildings/goblin_tailor.png";
import flag from "assets/nfts/flags/sunflower_flag.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { tailorAudio } from "lib/utils/sfx";
import { ItemsModal } from "features/goblins/tailor/ItemsModal";

export const RetreatTailor: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openTailor = () => {
    setIsOpen(true);
    //Checks if tailorAudio is playing, if false, plays the sound
    if (!tailorAudio.playing()) {
      tailorAudio.play();
    }
  };

  return (
    <div
      className="absolute z-10"
      style={{
        width: `${GRID_WIDTH_PX * 3.8}px`,
        left: `${GRID_WIDTH_PX * 13.2}px`,
        top: `${GRID_WIDTH_PX * 19.7}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img src={goblinTailor} className="w-full" onClick={openTailor} />
        {
          <Action
            className="absolute -bottom-7 left-4"
            text="Tailor"
            icon={flag}
            onClick={openTailor}
          />
        }
      </div>

      {isOpen && (
        <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
