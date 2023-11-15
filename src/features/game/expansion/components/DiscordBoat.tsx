import React from "react";

import boat from "assets/decorations/isles_boat.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

export const DiscordBoat: React.FC = () => {
  return (
    <>
      <div
        className="absolute boating left-0"
        style={{
          top: `${GRID_WIDTH_PX * 3}px`,
          width: `${PIXEL_SCALE * 63}px`,
        }}
      >
        <img src={boat} className="absolute top-0 right-0 w-full" />
      </div>
    </>
  );
};
