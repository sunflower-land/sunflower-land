import React from "react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import sword from "src/assets/icons/sword.png";
import warTent from "src/assets/buildings/war_tent.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { ItemsModal } from "./ItemsModal";

export const WarTent: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const side: "goblin" | "human" = "goblin";

  const openWarTent = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3.8}px`,
        height: `${GRID_WIDTH_PX * 3.8}px`,
        right: `${GRID_WIDTH_PX * -1.7}px`,
        bottom: `${GRID_WIDTH_PX * -5.5}px`,
      }}
    >
      <div
        onClick={openWarTent}
        className="w-full h-full cursor-pointer hover:img-highlight"
      >
        <img
          src={warTent}
          className="absolute opacity-100"
          style={{
            width: `${PIXEL_SCALE * 79}px`,
          }}
        />
        <img
          src={side === "goblin" ? femaleGoblin : femaleHuman}
          className="absolute left-9 bottom-6"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <img
          src={side === "goblin" ? maleGoblin : maleHuman}
          className="absolute right-8 bottom-10"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            transform: "scaleX(-1)",
          }}
        />
        {
          <Action
            className="absolute -bottom-5 left-4 whitespace-nowrap"
            text="War Tent"
            icon={sword}
            onClick={openWarTent}
          />
        }
      </div>

      {isOpen && (
        <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
