import React from "react";

import tent from "assets/buildings/tent.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Tent: React.FC = () => {
  return (
    <div className="h-full w-full flex items-end">
      <img
        src={tent}
        style={{
          width: `${PIXEL_SCALE * 46}px`,
        }}
        className="cursor-pointer hover:img-highlight"
      />
    </div>
  );
};
