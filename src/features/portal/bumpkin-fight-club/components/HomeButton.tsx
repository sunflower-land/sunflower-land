import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import worldIcon from "assets/icons/world.png";

import { goHome } from "../lib/utils";

export const HomeButton: React.FC = () => {
  const travelHome = () => {
    goHome();
  };

  return (
    <div
      className="flex relative z-50 justify-center cursor-pointer hover:img-highlight"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        height: `${PIXEL_SCALE * 23}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        travelHome();
      }}
    >
      <img
        src={SUNNYSIDE.ui.round_button}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
        }}
      />
      <img
        src={worldIcon}
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          left: `${PIXEL_SCALE * 5}px`,
          top: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
      />
    </div>
  );
};
