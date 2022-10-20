import React from "react";

import goblinTailor from "assets/buildings/goblin_tailor2.gif";
import clothesRack from "assets/decorations/clothes-rack.png";
import player from "assets/icons/player.png";

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
        left: `${GRID_WIDTH_PX * 13.5}px`,
        top: `${GRID_WIDTH_PX * 19.7}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight" onClick={openTailor}>
        <img src={goblinTailor} className="w-3/4" />
        <img src={clothesRack} className="w-3/5 absolute top-4 -right-20" />
        {
          <Action
            className="absolute -bottom-7 -left-4"
            text="Wearables"
            icon={player}
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
