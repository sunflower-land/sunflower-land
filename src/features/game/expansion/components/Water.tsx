import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

import dragonfly from "assets/decorations/dragonfly.gif";
import Shark from "./water/Shark";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import goblinSnorkling from "assets/npcs/goblin_snorkling.gif";
import swimmer from "assets/npcs/swimmer.gif";

export const Water: React.FC = () => {
  return (
    // Container
    <div
      style={{
        height: "inherit",
        width: "calc(100%)",
        left: "0",
        top: "0",
      }}
      className="absolute"
    >
      {/* Above Land */}
      <Shark side="top" />

      {/* Below Land */}
      <Shark side="bottom" />

      {/* Navigation Center Point */}
      <div className="h-full w-full relative">
        <span
          id={Section.Water}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <img
          src={dragonfly}
          className="absolute left-2/3 top-1/2 animate-float"
        />

        <img
          src={goblinSwimming}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            left: `${GRID_WIDTH_PX * 36}px`,
            top: `${GRID_WIDTH_PX * 22}px`,
            zIndex: "2",
          }}
        />

        <img
          src={goblinSnorkling}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 3.5}px`,
            left: `${GRID_WIDTH_PX * 30}px`,
            top: `${GRID_WIDTH_PX * 12}px`,
          }}
        />

        <img
          src={swimmer}
          className="absolute "
          style={{
            width: `${GRID_WIDTH_PX * 0.85}px`,
            left: `${GRID_WIDTH_PX * 42}px`,
            top: `${GRID_WIDTH_PX * 16}px`,
            transform: "scaleX(-1)",
            zIndex: "2",
          }}
        />
      </div>
    </div>
  );
};
