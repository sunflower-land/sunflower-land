import React from "react";

import goblin from "assets/npcs/goblin.gif";
import flag from "assets/nfts/flags/sunflower_flag.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { tailorAudio } from "lib/utils/sfx";
import { ItemsModal } from "./ItemsModal";

export const Tailor: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openTailor = () => {
    setIsOpen(true);
    tailorAudio.play();
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 0.9}px`,
        right: `${GRID_WIDTH_PX * 7.9}px`,
        top: `${GRID_WIDTH_PX * 6.6}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img src={goblin} className="w-full" onClick={openTailor} />
        {
          <Action
            className="absolute -bottom-10 -left-8"
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
