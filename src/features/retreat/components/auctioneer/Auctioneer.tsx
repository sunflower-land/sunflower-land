import React from "react";

import auctioneer from "assets/npcs/trivia.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

export const Auctioneer: React.FC = () => {
  return (
    <div
      className="z-10 absolute"
      style={{
        width: `${GRID_WIDTH_PX * 5.5}px`,
        left: `${GRID_WIDTH_PX * 16.5}px`,
        top: `${GRID_WIDTH_PX * 26.5}px`,
      }}
    >
      <img
        src={auctioneer}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
      />
    </div>
  );
};
