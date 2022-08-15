import React from "react";

import homeBase from "assets/buildings/recruiter_base.png";
import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

export const Recruiter: React.FC = () => {
  const side: "goblin" | "human" = "goblin";

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${GRID_WIDTH_PX * 51.57}px`,
        top: `${GRID_WIDTH_PX * 32.8}px`,
      }}
    >
      <img
        src={homeBase}
        style={{
          width: `${PIXEL_SCALE * 86}px`,
        }}
      />
      <img
        src={side === "goblin" ? femaleGoblin : femaleHuman}
        className="absolute left-20 -bottom-2 cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
      />
      <img
        src={side === "goblin" ? maleGoblin : maleHuman}
        className="absolute right-12 -bottom-2 cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
};
