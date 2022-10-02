import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

import chick from "assets/animals/chick.gif";
import dragonfly from "assets/decorations/dragonfly.gif";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import waterBoat from "assets/npcs/water_boat.png";
import { Frog } from "components/ui/Frog";
import { FrogNft } from "features/visiting/water/FrogNft";
import Shark from "components/ui/Shark";

export const Water: React.FC = () => {
  return (
    // Container
    <div
      style={{
        height: "650px",
        width: "1650px",
        left: "calc(50% - 1100px)",
        top: "calc(50% - 320px)",
      }}
      className="absolute"
    >
      <div className="h-full w-full relative">
        {/* Navigation Center Point */}
        <span
          id={Section.Water}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <img src={chick} className="absolute right-0 w-5 top-8" />
        <img
          src={dragonfly}
          className="absolute right-16 w-10 bottom-36 animate-float"
        />

        <Frog />
        <FrogNft />
        <Shark />
        <img
          src={goblinSwimming}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            left: `${GRID_WIDTH_PX * 5.5}px`,
            top: `${GRID_WIDTH_PX * 2}px`,
          }}
        />

        <img
          src={goblinSnorkling}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 3.5}px`,
            left: `${GRID_WIDTH_PX * 5}px`,
            top: `${GRID_WIDTH_PX * 11}px`,
          }}
        />

        <img
          src={waterBoat}
          className="absolute"
          style={{
            width: `${GRID_WIDTH_PX * 4.3}px`,
            right: `${GRID_WIDTH_PX * 6.4}px`,
            top: `${GRID_WIDTH_PX * 4.3}px`,
          }}
        />
      </div>
    </div>
  );
};
