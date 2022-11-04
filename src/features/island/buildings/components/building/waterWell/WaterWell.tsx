import React from "react";

import well from "assets/buildings/well1.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const WaterWell: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <img
        src={well}
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        className="cursor-pointer hover:img-highlight relative bottom-2"
      />
    </div>
  );
};
